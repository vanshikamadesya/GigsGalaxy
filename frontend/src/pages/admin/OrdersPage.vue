<template>
  <q-page class="q-pa-lg admin-page">
    <h1 class="text-h5 text-weight-bold q-mb-xl">All Orders</h1>
    <q-card class="gg-card">
      <q-card-section class="row items-center q-gutter-sm">
        <q-select v-model="statusFilter" :options="statusOptions" dense outlined clearable placeholder="All Statuses" emit-value map-options style="width:180px" @update:model-value="loadOrders" />
        <q-input v-model="search" dense outlined placeholder="Search orders..." style="width:220px" @update:model-value="loadOrders">
          <template #prepend><q-icon name="search" /></template>
        </q-input>
        <q-space />
        <q-btn flat no-caps icon="download" label="Export" color="primary" />
      </q-card-section>
      <q-separator />
      <q-table
        :rows="orders"
        :columns="columns"
        flat row-key="id"
        :loading="loading"
        :pagination="{ rowsPerPage: 20 }"
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="ORDER_STATUS_COLORS[props.value]" :label="ORDER_STATUS_LABELS[props.value]" />
          </q-td>
        </template>
        <template #no-data>
          <div class="text-center q-pa-xl text-grey-5">No orders found</div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { orderService } from 'src/services/order.service'
  import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from 'src/utils/constants'
  import type { Order } from 'src/types'

  const orders = ref<Order[]>([])
  const loading = ref(true)
  const search = ref('')
  const statusFilter = ref(null)

  const statusOptions = Object.keys(ORDER_STATUS_LABELS).map(k => ({ label: ORDER_STATUS_LABELS[k], value: k }))

  const columns = [
    { name: 'id', label: 'Order ID', field: 'id', format: (v: string) => `#${v.slice(-8)}`, align: 'left' as const },
    { name: 'gig', label: 'Gig', field: (r: Order) => r.gig?.title || '—', align: 'left' as const },
    { name: 'client', label: 'Client', field: (r: Order) => r.client?.fullName || '—', align: 'left' as const },
    { name: 'freelancer', label: 'Freelancer', field: (r: Order) => r.freelancer?.user?.fullName || '—', align: 'left' as const },
    { name: 'price', label: 'Amount', field: 'price', format: (v: number) => `$${v}`, align: 'right' as const },
    { name: 'status', label: 'Status', field: 'status', align: 'left' as const },
    { name: 'createdAt', label: 'Date', field: 'createdAt', format: (v: string) => new Date(v).toLocaleDateString(), align: 'left' as const }
  ]

  async function loadOrders() {
    loading.value = true
    try { const res = await orderService.getAllOrders(); orders.value = res.data }
    finally { loading.value = false }
  }

  onMounted(loadOrders)
</script>

<style lang="scss" scoped>
  .admin-page { background: #f4f1ff; }
  .body--dark .admin-page { background: #0f0a1e; }
</style>
