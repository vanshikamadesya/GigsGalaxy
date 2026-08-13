import { defineBoot } from '#q-app/wrappers'
import { io, type Socket } from 'socket.io-client'
import { useAuthStore } from 'src/stores/auth.store'
import { useChatStore } from 'src/stores/chat.store'
import { useNotificationStore } from 'src/stores/notification.store'
import { TOKEN_KEY } from 'src/utils/constants'
import { logger } from 'src/utils/logger'

let socket: Socket | null = null

export const getSocket = () => socket

export default defineBoot(() => {
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) return

  socket = io(`${SOCKET_URL}/chat`, {
    auth: { token: localStorage.getItem(TOKEN_KEY) },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  })

  socket.on('connect', () => {
    logger.info('[Socket] Connected:', socket?.id)
  })

  socket.on('disconnect', (reason) => {
    logger.info('[Socket] Disconnected:', reason)
  })

  // Chat events
  socket.on('new_message', (message) => {
    const chatStore = useChatStore()
    chatStore.receiveMessage(message)
  })

  socket.on('typing', ({ userId, conversationId, isTyping }) => {
    const chatStore = useChatStore()
    if (chatStore.activeConversation?.id === conversationId) {
      chatStore.setTyping(userId, isTyping)
    }
  })

  socket.on('user_online', ({ userId }) => {
    const chatStore = useChatStore()
    chatStore.setOnline(userId, true)
  })

  socket.on('user_offline', ({ userId }) => {
    const chatStore = useChatStore()
    chatStore.setOnline(userId, false)
  })

  // Notification events
  socket.on('notification', (notification) => {
    const notifStore = useNotificationStore()
    notifStore.addNotification(notification)
  })
})

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}

export function emitTyping(conversationId: string, isTyping: boolean) {
  socket?.emit('typing', { conversationId, isTyping })
}
