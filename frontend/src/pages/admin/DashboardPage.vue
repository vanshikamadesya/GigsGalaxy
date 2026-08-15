<template>
  <q-page class="q-pa-lg admin-page">
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h1 class="text-h5 text-weight-bold q-mb-xs">Admin Dashboard</h1>
        <p class="text-grey-6">Platform overview and key metrics</p>
      </div>
      <q-btn flat no-caps icon="download" label="Export Report" color="primary" @click="exportReport" />
    </div>

    <!-- Stats -->
    <div class="stats-grid q-mb-xl">
      <StatCard label="Total Users" :value="stats.totalUsers || 0" icon="people" color="primary" :loading="loading" />
      <StatCard label="Total Freelancers" :value="stats.totalFreelancers || 0" icon="engineering" color="secondary" :loading="loading" />
      <StatCard label="Total Orders" :value="stats.totalOrders || 0" icon="receipt_long" color="warning" :loading="loading" />
      <StatCard label="Platform Revenue" :value="stats.totalRevenue || 0" icon="payments" color="positive" type="currency" :loading="loading" />
    </div>

    <div class="row q-col-gutter-xl q-mb-xl">
      <!-- Revenue Chart -->
      <div class="col-12 col-md-8">
        <q-card class="gg-card q-pa-lg">
          <div class="row items-center justify-between q-mb-lg">
            <div class="text-subtitle1 text-weight-bold">Platform Revenue</div>
            <q-btn-toggle v-model="period" dense flat :options="periodOpts" toggle-color="primary" @update:model-value="loadChart" />
          </div>
          <div style="height:260px">
            <EarningsChart :data="chartData" :loading="chartLoading" />
          </div>
        </q-card>
      </div>

      <!-- Quick Stats -->
      <div class="col-12 col-md-4">
        <q-card class="gg-card q-pa-lg q-mb-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Pending Actions</div>
          <q-list dense>
            <q-item clickable v-ripple to="/admin/freelancers" class="action-item">
              <q-item-section avatar><q-icon name="verified_user" color="warning" /></q-item-section>
              <q-item-section>Verify Freelancers</q-item-section>
              <q-item-section side><q-badge color="warning" :label="stats.pendingVerifications || 0" /></q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/admin/gigs" class="action-item">
              <q-item-section avatar><q-icon name="approval" color="info" /></q-item-section>
              <q-item-section>Approve Gigs</q-item-section>
              <q-item-section side><q-badge color="info" :label="stats.pendingGigs || 0" /></q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/admin/orders" class="action-item">
              <q-item-section avatar><q-icon name="receipt_long" color="primary" /></q-item-section>
              <q-item-section>Active Orders</q-item-section>
              <q-item-section side><q-badge color="primary" :label="stats.activeOrders || 0" /></q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <q-card class="gg-card q-pa-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Platform Overview</div>
          <div class="overview-item row items-center justify-between q-mb-sm">
            <span class="text-sm text-grey-6">Total Gigs</span>
            <span class="text-weight-bold">{{ stats.totalGigs || 0 }}</span>
          </div>
          <div class="overview-item row items-center justify-between q-mb-sm">
            <span class="text-sm text-grey-6">Total Clients</span>
            <span class="text-weight-bold">{{ stats.totalClients || 0 }}</span>
          </div>
          <div class="overview-item row items-center justify-between">
            <span class="text-sm text-grey-6">Active Orders</span>
            <span class="text-weight-bold text-primary">{{ stats.activeOrders || 0 }}</span>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Recent Users -->
    <q-card class="gg-card">
      <q-card-section class="row items-center justify-between">
        <div class="text-subtitle1 text-weight-bold">Recent Users</div>
        <q-btn flat no-caps size="sm" to="/admin/users" label="View all" color="primary" />
      </q-card-section>
      <q-separator />
      <q-table :rows="recentUsers" :columns="userColumns" flat row-key="id" :pagination="{ rowsPerPage: 5 }">
        <template #body-cell-role="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'admin' ? 'warning' : props.value === 'freelancer' ? 'primary' : 'accent'" :label="props.value" />
          </q-td>
        </template>
        <template #body-cell-isVerified="props">
          <q-td :props="props">
            <q-icon :name="props.value ? 'verified' : 'cancel'" :color="props.value ? 'positive' : 'grey-4'" />
          </q-td>
        </template>
        <template #no-data>
          <div class="text-center q-pa-xl text-grey-5">No users</div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { dashboardService } from 'src/services/dashboard.service'
  import { userService } from 'src/services/user.service'
  import { useNotify } from 'src/composables/useNotify'
  import type { AdminStats, EarningsChart as EarningsChartType, User } from 'src/types'
  import StatCard from 'src/components/common/StatCard.vue'
  import EarningsChart from 'src/components/freelancer/EarningsChart.vue'

  const notify = useNotify()
  const loading = ref(true)
  const chartLoading = ref(true)
  const stats = ref<AdminStats>({ totalUsers: 0, totalFreelancers: 0, totalClients: 0, totalGigs: 0, totalOrders: 0, totalRevenue: 0, activeOrders: 0, pendingVerifications: 0, pendingGigs: 0 })
  const chartData = ref<EarningsChartType[]>([])
  const recentUsers = ref<User[]>([])
  const period = ref('month')

  const periodOpts = [{ label: 'Week', value: 'week' }, { label: 'Month', value: 'month' }, { label: 'Year', value: 'year' }]

  const userColumns = [
    { name: 'fullName', label: 'Name', field: 'fullName', align: 'left' as const },
    { name: 'email', label: 'Email', field: 'email', align: 'left' as const },
    { name: 'role', label: 'Role', field: 'role', align: 'left' as const },
    { name: 'isVerified', label: 'Verified', field: 'isVerified', align: 'center' as const },
    { name: 'createdAt', label: 'Joined', field: 'createdAt', format: (v: string) => new Date(v).toLocaleDateString(), align: 'left' as const }
  ]

  async function loadChart() {
    chartLoading.value = true
    chartData.value = await dashboardService.getAdminRevenueChart(period.value as 'week' | 'month' | 'year')
    chartLoading.value = false
  }

  function exportReport() {
    notify.info('Generating report... (PDF download in production)')
  }

  onMounted(async () => {
    await Promise.all([
      dashboardService.getAdminStats().then(s => { stats.value = s; loading.value = false }),
      loadChart(),
      userService.getAllUsers({ limit: 5, page: 1 }).then(r => { recentUsers.value = r.data })
    ])
  })
</script>