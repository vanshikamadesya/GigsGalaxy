import { Response } from 'express'
import User from '../models/User'
import Gig from '../models/Gig'
import Order from '../models/Order'
import Wallet from '../models/Wallet'
import { AuthRequest } from '../middleware/auth'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function buildChart(orders: any[], period: string) {
  const now = new Date()
  const chart: Record<string, { earnings: number; orders: number }> = {}

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now)
    if (period === 'year') {
      d.setMonth(d.getMonth() - i)
      const key = MONTHS[d.getMonth()]
      chart[key] = { earnings: 0, orders: 0 }
    } else {
      d.setDate(d.getDate() - i * 7)
      const key = `W${6 - i}`
      chart[key] = { earnings: 0, orders: 0 }
    }
  }

  for (const order of orders) {
    const d = new Date(order.completedAt || order.createdAt)
    const key =
      period === 'year' ? MONTHS[d.getMonth()] : `W${Math.min(6, Math.ceil((now.getTime() - d.getTime()) / (7 * 86400000)) || 1)}`
    if (chart[key]) {
      chart[key].earnings += order.totalAmount || 0
      chart[key].orders += 1
    }
  }

  return Object.entries(chart).map(([month, data]) => ({ month, ...data }))
}

export const getFreelancerStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id
    const [totalGigs, activeOrders, completedOrders] = await Promise.all([
      Gig.countDocuments({ seller: userId }),
      Order.countDocuments({ seller: userId, status: { $in: ['pending', 'accepted', 'in_progress', 'delivered'] } }),
      Order.countDocuments({ seller: userId, status: 'completed' })
    ])
    const wallet = await Wallet.findOne({ user: userId })
    const user = await User.findById(userId)

    res.json({
      totalGigs,
      activeOrders,
      completedOrders,
      totalEarnings: wallet?.totalEarnings || 0,
      totalReviews: user?.totalReviews || 0,
      averageRating: user?.averageRating || 0,
      responseRate: 95,
      onTimeDelivery: 98
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getFreelancerEarningsChart = async (req: AuthRequest, res: Response) => {
  try {
    const period = (req.query.period as string) || 'month'
    const orders = await Order.find({
      seller: req.user?.id,
      status: 'completed'
    })
    res.json(buildChart(orders, period))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getClientStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id
    const [activeOrders, completedOrders] = await Promise.all([
      Order.countDocuments({ buyer: userId, status: { $nin: ['completed', 'cancelled'] } }),
      Order.countDocuments({ buyer: userId, status: 'completed' })
    ])
    const wallet = await Wallet.findOne({ user: userId })

    res.json({
      activeOrders,
      completedOrders,
      totalSpending: wallet?.totalSpent || 0
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getAdminStats = async (_req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalFreelancers,
      totalClients,
      totalGigs,
      totalOrders,
      activeOrders,
      pendingGigs,
      pendingVerifications
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'freelancer' }),
      User.countDocuments({ role: 'client' }),
      Gig.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: { $nin: ['completed', 'cancelled'] } }),
      Gig.countDocuments({ status: 'active', approved: false }),
      User.countDocuments({ role: 'freelancer', verified: false })
    ])

    const completed = await Order.find({ status: 'completed' })
    const totalRevenue = completed.reduce((s, o) => s + (o.totalAmount || 0), 0)

    res.json({
      totalUsers,
      totalFreelancers,
      totalClients,
      totalGigs,
      totalOrders,
      totalRevenue,
      activeOrders,
      pendingVerifications,
      pendingGigs
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getAdminRevenueChart = async (req: AuthRequest, res: Response) => {
  try {
    const period = (req.query.period as string) || 'month'
    const orders = await Order.find({ status: 'completed' })
    res.json(buildChart(orders, period))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getActivityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const orders = await Order.find()
      .populate('gig buyer seller')
      .sort({ createdAt: -1 })
      .limit(20)
      .skip((page - 1) * 20)
    res.json({
      data: orders.map(o => ({
        type: 'order',
        message: `Order ${o.status}`,
        createdAt: o.createdAt
      }))
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
