import api from './api'
import type { Notification, PaginatedResponse } from 'src/types'

export const notificationService = {
  getNotifications: (page = 1) =>
    api.get<PaginatedResponse<Notification>>(`/notifications?page=${page}`).then(r => r.data),

  markAsRead: (id: string) =>
    api.patch(`/notifications/${id}/read`).then(r => r.data),

  markAllAsRead: () =>
    api.patch('/notifications/read-all').then(r => r.data),

  deleteNotification: (id: string) =>
    api.delete(`/notifications/${id}`).then(r => r.data),

  getUnreadCount: () =>
    api.get<{ count: number }>('/notifications/unread-count').then(r => r.data)
}
