<template>
  <q-page class="dashboard-page q-pa-lg">
    <!-- Welcome banner -->
    <div class="welcome-banner q-mb-xl">
      <div class="row items-center justify-between">
        <div>
          <h1 class="welcome-title">Welcome back, {{ authStore.user?.fullName?.split(' ')[0] }} 👋</h1>
          <p class="text-grey-6">Here's what's happening with your business today.</p>
        </div>
        <q-btn unelevated no-caps to="/freelancer/gigs/create" label="Create New Gig" icon="add" class="btn-primary" />
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid q-mb-xl">
      <StatCard label="Total Gigs" :value="stats.totalGigs || 0" icon="work_outline" color="primary" :loading="statsLoading" />
      <StatCard label="Active Orders" :value="stats.activeOrders || 0" icon="receipt_long" color="warning" :loading="statsLoading" />
      <StatCard label="Completed" :value="stats.completedOrders || 0" icon="check_circle_outline" color="positive" :loading="statsLoading" />
      <StatCard label="Total Earnings" :value="stats.totalEarnings || 0" icon="account_balance_wallet" color="secondary" type="currency" :loading="statsLoading" />
    </div>

    <div class="row q-col-gutter-xl">
      <!-- Earnings Chart -->
      <div class="col-12 col-md-8">
        <q-card class="gg-card q-pa-lg">
          <div class="row items-center justify-between q-mb-lg">
            <div class="text-subtitle1 text-weight-bold">Monthly Earnings</div>
            <q-btn-toggle v-model="chartPeriod" dense flat :options="periodOptions" toggle-color="primary" @update:model-value="loadChart" />
          </div>
          <div class="chart-container">
            <EarningsChart :data="chartData" :loading="chartLoading" />
          </div>
        </q-card>
      </div>

      <!-- Quick Actions + Recent Orders -->
      <div class="col-12 col-md-4">
        <q-card class="gg-card q-pa-lg q-mb-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Quick Actions</div>
          <q-list dense>
            <q-item clickable v-ripple to="/freelancer/gigs/create" class="quick-action-item">
              <q-item-section avatar><q-icon name="add_circle" color="primary" /></q-item-section>
              <q-item-section>Create New Gig</q-item-section>
              <q-item-section side><q-icon name="chevron_right" /></q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/freelancer/orders" class="quick-action-item">
              <q-item-section avatar><q-icon name="inbox" color="warning" /></q-item-section>
              <q-item-section>View Pending Orders</q-item-section>
              <q-item-section side>
                <q-badge v-if="orderStore.pendingOrders.length" color="warning" :label="orderStore.pendingOrders.length" />
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/freelancer/messages" class="quick-action-item">
              <q-item-section avatar><q-icon name="chat_bubble_outline" color="info" /></q-item-section>
              <q-item-section>Messages</q-item-section>
              <q-item-section side>
                <q-badge v-if="chatStore.totalUnread" color="negative" :label="chatStore.totalUnread" />
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/freelancer/wallet" class="quick-action-item">
              <q-item-section avatar><q-icon name="payments" color="positive" /></q-item-section>
              <q-item-section>Wallet & Withdraw</q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <!-- Pending orders -->
        <q-card class="gg-card q-pa-lg">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold">Pending Orders</div>
            <q-btn flat no-caps size="sm" to="/freelancer/orders" label="View all" color="primary" />
          </div>
          <div v-if="!orderStore.pendingOrders.length" class="text-center text-grey-5 q-py-lg">
            <q-icon name="check_circle" size="36px" color="positive" class="q-mb-sm" />
            <div class="text-sm">No pending orders</div>
          </div>
          <q-list v-else dense separator>
            <q-item
              v-for="order in orderStore.pendingOrders.slice(0, 5)"
              :key="order.id"
              clickable v-ripple
              :to="`/freelancer/orders/${order.id}`"
            >
              <q-item-section avatar>
                <q-avatar size="32px" color="accent" text-color="white">
                  <span class="text-caption">{{ getInitials(order.client?.fullName || '') }}</span>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-sm text-weight-medium">{{ truncate(order.gig?.title || '', 30) }}</q-item-label>
                <q-item-label caption>${{ order.price }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="warning" label="Pending" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- Recent Activity -->
    <q-card class="gg-card q-pa-lg q-mt-xl">
      <div class="text-subtitle1 text-weight-bold q-mb-md">Recent Orders</div>
      <q-table
        :rows="orderStore.orders.slice(0, 10)"
        :columns="orderColumns"
        flat
        row-key="id"
        :loading="orderStore.loading"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="ORDER_STATUS_COLORS[props.value]" :label="ORDER_STATUS_LABELS[props.value]" />
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense size="sm" icon="visibility" color="primary" :to="`/freelancer/orders/${props.row.id}`" />
          </q-td>
        </template>
        <template #no-data>
          <div class="full-width text-center q-pa-xl text-grey-5">No orders yet</div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useAuthStore } from 'src/stores/auth.store'
  import { useOrderStore } from 'src/stores/order.store'
  import { useChatStore } from 'src/stores/chat.store'
  import { dashboardService } from 'src/services/dashboard.service'
  import { getInitials, truncate } from 'src/utils/helpers'
  import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from 'src/utils/constants'
  import type { DashboardStats, EarningsChart as EarningsChartType } from 'src/types'
  import StatCard from 'src/components/common/StatCard.vue'
  import EarningsChart from 'src/components/freelancer/EarningsChart.vue'

  const authStore = useAuthStore()
  const orderStore = useOrderStore()
  const chatStore = useChatStore()

  const stats = ref<DashboardStats>({ activeOrders: 0, completedOrders: 0 })
  const statsLoading = ref(true)
  const chartData = ref<EarningsChartType[]>([])
  const chartLoading = ref(true)
  const chartPeriod = ref('month')

  const periodOptions = [
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' }
  ]

  const orderColumns = [
    { name: 'gig', label: 'Gig', field: (r: { gig?: { title?: string } }) => r.gig?.title || '—', align: 'left' as const, style: 'max-width:200px' },
    { name: 'client', label: 'Client', field: (r: { client?: { fullName?: string } }) => r.client?.fullName || '—', align: 'left' as const },
    { name: 'price', label: 'Amount', field: 'price', format: (v: number) => `$${v}`, align: 'left' as const },
    { name: 'status', label: 'Status', field: 'status', align: 'left' as const },
    { name: 'actions', label: '', field: 'id', align: 'right' as const }
  ]

  async function loadChart() {
    chartLoading.value = true
    try {
      chartData.value = await dashboardService.getFreelancerEarningsChart(chartPeriod.value as 'week' | 'month' | 'year')
    } finally {
      chartLoading.value = false
    }
  }

  onMounted(async () => {
    await Promise.all([
      dashboardService.getFreelancerStats().then(s => { stats.value = s; statsLoading.value = false }),
      orderStore.fetchMyOrders('freelancer'),
      loadChart()
    ])
  })
</script>