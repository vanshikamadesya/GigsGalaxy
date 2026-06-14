import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notificationService } from 'src/services/notification.service'
import type { Notification } from 'src/types'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)

  const hasUnread = computed(() => unreadCount.value > 0)

  async function fetchNotifications(page = 1) {
    loading.value = true
    try {
      const result = await notificationService.getNotifications(page)
      if (page === 1) {
        notifications.value = result.data
      } else {
        notifications.value.push(...result.data)
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchUnreadCount() {
    const result = await notificationService.getUnreadCount()
    unreadCount.value = result.count
  }

  async function markAsRead(id: string) {
    await notificationService.markAsRead(id)
    const notif = notifications.value.find(n => n.id === id)
    if (notif && !notif.isRead) {
      notif.isRead = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  async function markAllAsRead() {
    await notificationService.markAllAsRead()
    notifications.value.forEach(n => (n.isRead = true))
    unreadCount.value = 0
  }

  function addNotification(notification: Notification) {
    notifications.value.unshift(notification)
    if (!notification.isRead) unreadCount.value++
  }

  return {
    notifications,
    unreadCount,
    loading,
    hasUnread,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    addNotification
  }
})
