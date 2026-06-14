import { Response } from 'express'
import Order from '../models/Order'
import Gig from '../models/Gig'
import Wallet from '../models/Wallet'
import { AuthRequest } from '../middleware/auth'
import { paginated } from '../utils/pagination'
import { formatOrder } from '../utils/serializers'
import { createNotification } from '../utils/notifications'

function getPackagePrice(gig: any, packageType: string) {
  const pkg =
    gig.packages?.find((p: any) => p.name === packageType) ||
    gig.packages?.[0]
  return pkg?.price || gig.basePrice
}

function getDeliveryDate(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { gigId, packageType = 'basic', requirements = [] } = req.body
    const gig = await Gig.findById(gigId)
    if (!gig) return res.status(404).json({ message: 'Gig not found' })

    const price = getPackagePrice(gig, packageType)
    const pkg = gig.packages?.find(p => p.name === packageType) || gig.packages?.[0]
    const deliveryDays = pkg?.deliveryTime || gig.deliveryDays

    const order = new Order({
      gig: gigId,
      buyer: req.user?.id,
      seller: gig.seller,
      packageType,
      amount: price,
      totalAmount: price,
      requirements,
      deliveryDate: getDeliveryDate(deliveryDays),
      status: 'pending'
    })

    await order.save()
    await order.populate(['gig', 'buyer', 'seller'])

    await createNotification(
      gig.seller.toString(),
      'new_order',
      'New Order Received',
      `You have a new order for "${gig.title}"`,
      `/freelancer/orders/${order._id}`
    )

    res.status(201).json(formatOrder(order))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    const { status, role } = req.query

    const query: any =
      role === 'freelancer' ? { seller: req.user?.id } : { buyer: req.user?.id }
    if (status) query.status = status

    const orders = await Order.find(query)
      .populate(['gig', 'buyer', 'seller'])
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
    const total = await Order.countDocuments(query)

    res.json(paginated(orders.map(o => formatOrder(o)), total, page, limit))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const skip = (page - 1) * limit
    const { status, search } = req.query
    const query: any = {}
    if (status) query.status = status

    let orders = await Order.find(query)
      .populate(['gig', 'buyer', 'seller'])
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    if (search) {
      const s = String(search).toLowerCase()
      orders = orders.filter(o => {
        const gig = o.gig as any
        return gig?.title?.toLowerCase().includes(s)
      })
    }

    const total = await Order.countDocuments(query)
    res.json(paginated(orders.map(o => formatOrder(o)), total, page, limit))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate(['gig', 'buyer', 'seller'])
    if (!order) return res.status(404).json({ message: 'Order not found' })

    const userId = req.user?.id
    const isAdmin = req.user?.role === 'admin'
    if (
      !isAdmin &&
      order.buyer.toString() !== userId &&
      order.seller.toString() !== userId
    ) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    res.json(formatOrder(order))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function updateStatus(
  req: AuthRequest,
  res: Response,
  status: string,
  extra: Record<string, unknown> = {}
) {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    const userId = req.user?.id
    if (status === 'accepted' || status === 'in_progress' || status === 'delivered') {
      if (order.seller.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized' })
      }
    }
    if (status === 'completed') {
      if (order.buyer.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized' })
      }
    }

    order.status = status as any
    Object.assign(order, extra)
    if (status === 'completed') {
      order.completedAt = new Date()
      const wallet = await Wallet.findOne({ user: order.seller })
      if (wallet) {
        wallet.balance += order.totalAmount
        wallet.totalEarnings += order.totalAmount
        wallet.transactions.push({
          type: 'credit',
          amount: order.totalAmount,
          description: 'Order completed',
          orderId: order._id,
          balanceAfter: wallet.balance,
          status: 'completed',
          date: new Date()
        })
        await wallet.save()
      }
      await Gig.findByIdAndUpdate(order.gig, { $inc: { orderCount: 1 } })
    }

    await order.save()
    await order.populate(['gig', 'buyer', 'seller'])
    return res.json(formatOrder(order))
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const acceptOrder = (req: AuthRequest, res: Response) =>
  updateStatus(req, res, 'accepted')

export const rejectOrder = async (req: AuthRequest, res: Response) => {
  const { reason } = req.body
  return updateStatus(req, res, 'cancelled', {
    cancelReason: reason,
    cancelledAt: new Date()
  })
}

export const deliverOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (order.seller.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const deliverables = order.deliverables || []
    if (req.body.description || req.body.message) {
      deliverables.push({
        fileName: req.body.fileName || 'delivery.txt',
        fileUrl: req.body.fileUrl || '',
        fileSize: 0,
        description: req.body.description || req.body.message,
        uploadedAt: new Date()
      })
    }
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        deliverables.push({
          fileName: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
          fileSize: file.size,
          uploadedAt: new Date()
        })
      }
    }

    order.deliverables = deliverables
    order.status = 'delivered'
    await order.save()
    await order.populate(['gig', 'buyer', 'seller'])

    await createNotification(
      order.buyer.toString(),
      'project_delivered',
      'Project Delivered',
      'Your order has been delivered for review',
      `/client/orders/${order._id}`
    )

    res.json(formatOrder(order))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const completeOrder = (req: AuthRequest, res: Response) =>
  updateStatus(req, res, 'completed')

export const cancelOrder = async (req: AuthRequest, res: Response) => {
  const { reason } = req.body
  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).json({ message: 'Order not found' })
  if (
    order.buyer.toString() !== req.user?.id &&
    order.seller.toString() !== req.user?.id
  ) {
    return res.status(403).json({ message: 'Not authorized' })
  }
  return updateStatus(req, res, 'cancelled', {
    cancelReason: reason,
    cancelledAt: new Date()
  })
}

export const requestRevision = async (req: AuthRequest, res: Response) => {
  const { notes } = req.body
  const order = await Order.findById(req.params.id)
  if (!order) return res.status(404).json({ message: 'Order not found' })
  if (order.buyer.toString() !== req.user?.id) {
    return res.status(403).json({ message: 'Not authorized' })
  }
  return updateStatus(req, res, 'in_progress', { revisionNotes: notes })
}

export const updateOrderStatus = acceptOrder
