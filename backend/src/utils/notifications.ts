import Notification from '../models/Notification'
import { formatNotification } from './serializers'
import { getIO } from '../socket'

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  actionUrl?: string,
  data?: Record<string, unknown>
) {
  const notification = await Notification.create({
    user: userId,
    type,
    title,
    message,
    actionUrl,
    data
  })

  const formatted = formatNotification(notification)
  try {
    getIO()?.to(`user:${userId}`).emit('notification', formatted)
  } catch {
    /* socket not ready */
  }

  return formatted
}
