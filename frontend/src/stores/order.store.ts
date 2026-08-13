import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { orderService } from 'src/services/order.service'
import type { Order, OrderRequirement } from 'src/types'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const activeOrders = computed(() =>
    orders.value.filter(o => ['accepted', 'in_progress'].includes(o.status))
  )
  const completedOrders = computed(() =>
    orders.value.filter(o => o.status === 'completed')
  )
  const pendingOrders = computed(() =>
    orders.value.filter(o => o.status === 'pending')
  )

  async function fetchMyOrders(role: 'client' | 'freelancer', status?: string) {
    loading.value = true
    error.value = null
    try {
      const result = await orderService.getMyOrders(role, status)
      orders.value = result.data
    } catch (err: unknown) {
      const e = err as { message?: string }
      error.value = e.message || 'Failed to fetch orders'
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderById(id: string) {
    loading.value = true
    try {
      currentOrder.value = await orderService.getOrderById(id)
    } finally {
      loading.value = false
    }
  }

  async function createOrder(payload: {
    gigId: string
    packageType: 'basic' | 'standard' | 'premium'
    requirements: OrderRequirement[]
  }) {
    const order = await orderService.createOrder(payload)
    orders.value.unshift(order)
    return order
  }

  async function acceptOrder(id: string) {
    const updated = await orderService.acceptOrder(id)
    updateOrderInList(updated)
    return updated
  }

  async function rejectOrder(id: string, reason: string) {
    const updated = await orderService.rejectOrder(id, reason)
    updateOrderInList(updated)
    return updated
  }

  async function deliverOrder(id: string, formData: FormData) {
    const updated = await orderService.deliverOrder(id, formData)
    updateOrderInList(updated)
    return updated
  }

  async function completeOrder(id: string) {
    const updated = await orderService.completeOrder(id)
    updateOrderInList(updated)
    return updated
  }

  async function cancelOrder(id: string, reason: string) {
    const updated = await orderService.cancelOrder(id, reason)
    updateOrderInList(updated)
    return updated
  }

  function updateOrderInList(order: Order) {
    const idx = orders.value.findIndex(o => o.id === order.id)
    if (idx !== -1) orders.value[idx] = order
    if (currentOrder.value?.id === order.id) currentOrder.value = order
  }

  return {
    orders,
    currentOrder,
    loading,
    error,
    activeOrders,
    completedOrders,
    pendingOrders,
    fetchMyOrders,
    fetchOrderById,
    createOrder,
    acceptOrder,
    rejectOrder,
    deliverOrder,
    completeOrder,
    cancelOrder
  }
})
