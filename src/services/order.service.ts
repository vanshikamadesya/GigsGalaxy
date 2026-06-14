import api from './api'
import type { Order, PaginatedResponse, OrderRequirement } from 'src/types'

export const orderService = {
  createOrder: (payload: {
    gigId: string
    packageType: 'basic' | 'standard' | 'premium'
    requirements: OrderRequirement[]
  }) => api.post<Order>('/orders', payload).then(r => r.data),

  getMyOrders: (role: 'client' | 'freelancer', status?: string) =>
    api.get<PaginatedResponse<Order>>(`/orders/my?role=${role}${status ? `&status=${status}` : ''}`).then(r => r.data),

  getOrderById: (id: string) =>
    api.get<Order>(`/orders/${id}`).then(r => r.data),

  acceptOrder: (id: string) =>
    api.patch<Order>(`/orders/${id}/accept`).then(r => r.data),

  rejectOrder: (id: string, reason: string) =>
    api.patch<Order>(`/orders/${id}/reject`, { reason }).then(r => r.data),

  deliverOrder: (id: string, formData: FormData) =>
    api.patch<Order>(`/orders/${id}/deliver`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data),

  completeOrder: (id: string) =>
    api.patch<Order>(`/orders/${id}/complete`).then(r => r.data),

  cancelOrder: (id: string, reason: string) =>
    api.patch<Order>(`/orders/${id}/cancel`, { reason }).then(r => r.data),

  requestRevision: (id: string, notes: string) =>
    api.patch<Order>(`/orders/${id}/revision`, { notes }).then(r => r.data),

  // Admin
  getAllOrders: (filters: Record<string, unknown> = {}) =>
    api.get<PaginatedResponse<Order>>('/admin/orders').then(r => r.data)
}
