import { Response } from 'express'
import Notification from '../models/Notification'
import { AuthRequest } from '../middleware/auth'
import { paginated } from '../utils/pagination'
import { formatNotification } from '../utils/serializers'

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const skip = (page - 1) * limit
    const notifications = await Notification.find({ user: req.user?.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
    const total = await Notification.countDocuments({ user: req.user?.id })
    res.json(
      paginated(notifications.map(n => formatNotification(n)), total, page, limit)
    )
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.id },
      { isRead: true }
    )
    res.json({ message: 'Notification marked as read' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany({ user: req.user?.id }, { isRead: true })
    res.json({ message: 'All notifications marked as read' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.deleteOne({ _id: req.params.id, user: req.user?.id })
    res.json({ message: 'Notification deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user?.id,
      isRead: false
    })
    res.json({ count })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
