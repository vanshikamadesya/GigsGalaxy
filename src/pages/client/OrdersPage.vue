<template>
  <q-page class="q-pa-lg">
    <h1 class="text-h5 text-weight-bold q-mb-xl">My Orders</h1>

    <q-tabs v-model="statusTab" class="q-mb-lg" active-color="primary" indicator-color="primary" align="left" dense>
      <q-tab name="all" label="All Orders" />
      <q-tab name="pending" label="Pending" />
      <q-tab name="in_progress" label="In Progress" />
      <q-tab name="delivered" label="Delivered" />
      <q-tab name="completed" label="Completed" />
    </q-tabs>

    <q-card class="gg-card">
      <q-table
        :rows="filteredOrders"
        :columns="columns"
        flat row-key="id"
        :loading="orderStore.loading"
        :pagination="{ rowsPerPage: 15 }"
      >
        <template #body-cell-gig="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-sm">
              <q-img :src="props.row.gig?.images?.[0]" style="width:40px;height:40px;border-radius:6px" />
              <span class="text-sm text-weight-medium" style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ props.row.gig?.title }}</span>
            </div>
          </q-td>
        </template>
        <template #body-cell-freelancer="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-xs">
              <q-avatar size="26px" color="primary" text-color="white" class="text-caption">{{ getInitials(props.row.freelancer?.user?.fullName || '') }}</q-avatar>
              <span class="text-sm">{{ props.row.freelancer?.user?.fullName }}</span>
            </div>
          </q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="ORDER_STATUS_COLORS[props.value]" :label="ORDER_STATUS_LABELS[props.value]" />
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense round size="sm" icon="visibility" color="primary" :to="`/client/orders/${props.row.id}`" />
            <q-btn v-if="props.row.status === 'pending'" flat dense round size="sm" icon="cancel" color="negative" @click="cancelOrder(props.row)" />
          </q-td>
        </template>
        <template #no-data>
          <div class="full-width text-center q-pa-xl text-grey-5">No orders found</div>
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

  const filteredOrders = computed(() =>
    statusTab.value === 'all' ? orderStore.orders : orderStore.orders.filter(o => o.status === statusTab.value)
  )

  const columns = [
    { name: 'gig', label: 'Gig', field: 'gig', align: 'left' as const },
    { name: 'freelancer', label: 'Freelancer', field: 'freelancer', align: 'left' as const },
    { name: 'price', label: 'Amount', field: 'price', format: (v: number) => `$${v}`, align: 'left' as const },
    { name: 'dueDate', label: 'Due Date', field: 'dueDate', format: (v: string) => v ? new Date(v).toLocaleDateString() : '—', align: 'left' as const },
    { name: 'status', label: 'Status', field: 'status', align: 'left' as const },
    { name: 'actions', label: '', field: 'id', align: 'right' as const }
  ]

  async function cancelOrder(order: Order) {
    notify.confirm('Cancel this order? This cannot be undone.', async () => {
      try {
        await orderStore.cancelOrder(order.id, 'Cancelled by client')
        notify.success('Order cancelled')
      } catch { notify.error('Failed to cancel') }
    })
  }

  onMounted(() => orderStore.fetchMyOrders('client'))
</script>
