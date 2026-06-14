import api from './api'
import type { Conversation, Message, PaginatedResponse } from 'src/types'

export const chatService = {
  getConversations: () =>
    api.get<Conversation[]>('/chat/conversations').then(r => r.data),

  getOrCreateConversation: (participantId: string, orderId?: string) =>
    api.post<Conversation>('/chat/conversations', { participantId, orderId }).then(r => r.data),

  getMessages: (conversationId: string, page = 1, limit = 50) =>
    api.get<PaginatedResponse<Message>>(
      `/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
    ).then(r => r.data),

  sendMessage: (conversationId: string, formData: FormData) =>
    api.post<Message>(`/chat/conversations/${conversationId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data),

  markAsRead: (conversationId: string) =>
    api.patch(`/chat/conversations/${conversationId}/read`).then(r => r.data),

  deleteMessage: (messageId: string) =>
    api.delete(`/chat/messages/${messageId}`).then(r => r.data)
}
