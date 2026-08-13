<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h1 class="text-h5 text-weight-bold q-mb-xs">Orders</h1>
        <p class="text-grey-6">Manage your client orders</p>
      </div>
    </div>

    <!-- Status filter tabs -->
    <q-tabs v-model="statusTab" class="q-mb-lg" active-color="primary" indicator-color="primary" align="left" dense>
      <q-tab name="all" label="All" />
      <q-tab name="pending" label="Pending">
        <q-badge v-if="pending.length" color="warning" floating rounded :label="pending.length" />
      </q-tab>
      <q-tab name="in_progress" label="In Progress" />
      <q-tab name="delivered" label="Delivered" />
      <q-tab name="completed" label="Completed" />
      <q-tab name="cancelled" label="Cancelled" />
    </q-tabs>

    <!-- Orders table -->
    <q-card class="gg-card">
      <q-table
        :rows="filteredOrders"
        :columns="columns"
        flat
        row-key="id"
        :loading="orderStore.loading"
        :pagination="{ rowsPerPage: 15 }"
      >
        <template #body-cell-gig="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-sm">
              <q-img :src="props.row.gig?.images?.[0] || 'https://placehold.co/40x40'" style="width:40px;height:40px;border-radius:6px" />
              <div>
                <div class="text-sm text-weight-medium" style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ props.row.gig?.title }}</div>
                <div class="text-xs text-grey-5 capitalize">{{ props.row.packageType }} package</div>
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-client="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-xs">
              <q-avatar size="26px" color="accent" text-color="white" class="text-caption">
                {{ getInitials(props.row.client?.fullName || '') }}
              </q-avatar>
              <span class="text-sm">{{ props.row.client?.fullName }}</span>
            </div>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="ORDER_STATUS_COLORS[props.value]" :label="ORDER_STATUS_LABELS[props.value]" />
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" class="row items-center q-gutter-xs">
            <q-btn flat dense round size="sm" icon="visibility" color="primary" :to="`/freelancer/orders/${props.row.id}`" />
            <q-btn
              v-if="props.row.status === 'pending'"
              flat dense round size="sm" icon="check_circle" color="positive"
              @click="acceptOrder(props.row.id)"
            />
            <q-btn
              v-if="props.row.status === 'pending'"
              flat dense round size="sm" icon="cancel" color="negative"
              @click="rejectOrder(props.row)"
            />
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width text-center q-pa-xl text-grey-5">
            <q-icon name="receipt_long" size="48px" class="q-mb-md" />
            <div>No orders in this category</div>
          </div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useOrderStore } from 'src/stores/order.store'
  import { useNotify } from 'src/composables/useNotify'
  import { getInitials } from 'src/utils/helpers'
  import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from 'src/utils/constants'
  import type { Order } from 'src/types'

  const orderStore = useOrderStore()
  const notify = useNotify()

  const statusTab = ref('all')

  const pending = computed(() => orderStore.orders.filter(o => o.status === 'pending'))

  const filteredOrders = computed(() => {
    if (statusTab.value === 'all') return orderStore.orders
    return orderStore.orders.filter(o => o.status === statusTab.value)
  })

  const columns = [
    { name: 'gig', label: 'Gig', field: 'gig', align: 'left' as const },
    { name: 'client', label: 'Client', field: 'client', align: 'left' as const },
    { name: 'price', label: 'Amount', field: 'price', format: (v: number) => `$${v}`, align: 'left' as const },
    { name: 'dueDate', label: 'Due Date', field: 'dueDate', format: (v: string) => v ? new Date(v).toLocaleDateString() : '—', align: 'left' as const },
    { name: 'status', label: 'Status', field: 'status', align: 'left' as const },
    { name: 'actions', label: 'Actions', field: 'id', align: 'right' as const }
  ]

  async function acceptOrder(id: string) {
    try {
      await orderStore.acceptOrder(id)
      notify.success('Order accepted')
    } catch {
      notify.error('Failed to accept order')
    }
  }

  async function rejectOrder(order: Order) {
    notify.confirm('Are you sure you want to reject this order?', async () => {
      try {
        await orderStore.rejectOrder(order.id, 'Order rejected')
        notify.success('Order rejected')
      } catch {
        notify.error('Failed to reject order')
      }
    })
  }

  onMounted(() => orderStore.fetchMyOrders('freelancer'))
</script>
