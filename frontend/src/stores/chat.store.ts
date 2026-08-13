import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { chatService } from 'src/services/chat.service'
import type { Conversation, Message } from 'src/types'

export const useChatStore = defineStore('chat', () => {
  const conversations = ref<Conversation[]>([])
  const activeConversation = ref<Conversation | null>(null)
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const typingUsers = ref<Set<string>>(new Set())
  const onlineUsers = ref<Set<string>>(new Set())

  const totalUnread = computed(() =>
    conversations.value.reduce((acc, c) => acc + c.unreadCount, 0)
  )

  const sortedConversations = computed(() =>
    [...conversations.value].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  )

  async function fetchConversations() {
    loading.value = true
    try {
      conversations.value = await chatService.getConversations()
    } finally {
      loading.value = false
    }
  }

  async function openConversation(participantId: string, orderId?: string) {
    const conv = await chatService.getOrCreateConversation(participantId, orderId)
    activeConversation.value = conv
    const existing = conversations.value.find(c => c.id === conv.id)
    if (!existing) conversations.value.unshift(conv)
    await loadMessages(conv.id)
    return conv
  }

  async function loadMessages(conversationId: string, page = 1) {
    loading.value = true
    try {
      const result = await chatService.getMessages(conversationId, page)
      if (page === 1) {
        messages.value = result.data.reverse()
      } else {
        messages.value = [...result.data.reverse(), ...messages.value]
      }
    } finally {
      loading.value = false
    }
  }

  async function sendMessage(content: string, type: 'text' | 'image' | 'file' = 'text', file?: File) {
    if (!activeConversation.value) return
    const formData = new FormData()
    formData.append('content', content)
    formData.append('type', type)
    if (file) formData.append('file', file)
    const message = await chatService.sendMessage(activeConversation.value.id, formData)
    messages.value.push(message)
    updateConversationLastMessage(activeConversation.value.id, message)
    return message
  }

  function receiveMessage(message: Message) {
    if (activeConversation.value?.id === message.conversationId) {
      messages.value.push(message)
    }
    updateConversationLastMessage(message.conversationId, message)
    const conv = conversations.value.find(c => c.id === message.conversationId)
    if (conv && activeConversation.value?.id !== message.conversationId) {
      conv.unreadCount++
    }
  }

  function updateConversationLastMessage(conversationId: string, message: Message) {
    const conv = conversations.value.find(c => c.id === conversationId)
    if (conv) {
      conv.lastMessage = message
      conv.updatedAt = message.createdAt
    }
  }

  function setTyping(userId: string, isTyping: boolean) {
    if (isTyping) {
      typingUsers.value.add(userId)
    } else {
      typingUsers.value.delete(userId)
    }
  }

  function setOnline(userId: string, isOnline: boolean) {
    if (isOnline) {
      onlineUsers.value.add(userId)
    } else {
      onlineUsers.value.delete(userId)
    }
  }

  async function markAsRead(conversationId: string) {
    await chatService.markAsRead(conversationId)
    const conv = conversations.value.find(c => c.id === conversationId)
    if (conv) conv.unreadCount = 0
  }

  return {
    conversations,
    activeConversation,
    messages,
    loading,
    typingUsers,
    onlineUsers,
    totalUnread,
    sortedConversations,
    fetchConversations,
    openConversation,
    loadMessages,
    sendMessage,
    receiveMessage,
    setTyping,
    setOnline,
    markAsRead
  }
})
