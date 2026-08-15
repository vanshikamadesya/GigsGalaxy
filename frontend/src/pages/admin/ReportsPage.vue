<template>
  <q-page class="q-pa-lg admin-page">
    <div class="row items-center justify-between q-mb-xl">
      <h1 class="text-h5 text-weight-bold">Reports & Analytics</h1>
      <q-btn unelevated no-caps icon="download" label="Export PDF" class="btn-primary" @click="exportPdf" />
    </div>

    <div class="stats-grid q-mb-xl">
      <StatCard label="Total Revenue" :value="12450" icon="payments" color="positive" type="currency" />
      <StatCard label="Gross Merchandise Value" :value="84230" icon="store" color="primary" type="currency" />
      <StatCard label="Platform Fee Collected" :value="4211.5" icon="account_balance" color="secondary" type="currency" />
      <StatCard label="Avg. Order Value" :value="87.5" icon="bar_chart" color="warning" type="currency" />
    </div>

    <div class="row q-col-gutter-xl">
      <div class="col-12 col-md-6">
        <q-card class="gg-card q-pa-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-lg">Orders by Status</div>
          <div v-for="s in orderStatusData" :key="s.label" class="q-mb-sm">
            <div class="row items-center justify-between q-mb-xs">
              <span class="text-sm">{{ s.label }}</span>
              <span class="text-sm text-weight-bold">{{ s.count }}</span>
            </div>
            <q-linear-progress :value="s.count / 120" :color="s.color" style="height:8px;border-radius:4px" />
          </div>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card class="gg-card q-pa-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-lg">Top Categories</div>
          <div v-for="(cat, i) in topCategories" :key="cat.name" class="q-mb-sm">
            <div class="row items-center justify-between q-mb-xs">
              <span class="text-sm">{{ cat.name }}</span>
              <span class="text-sm text-weight-bold">{{ cat.revenue }}</span>
            </div>
            <q-linear-progress :value="cat.pct" color="primary" style="height:8px;border-radius:4px" />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { useNotify } from 'src/composables/useNotify'
  import StatCard from 'src/components/common/StatCard.vue'

  const notify = useNotify()

  const orderStatusData = [
    { label: 'Completed', count: 74, color: 'positive' },
    { label: 'In Progress', count: 32, color: 'primary' },
    { label: 'Delivered', count: 18, color: 'teal' },
    { label: 'Pending', count: 12, color: 'warning' },
    { label: 'Cancelled', count: 8, color: 'negative' }
  ]

  const topCategories = [
    { name: 'Web Development', revenue: '$4,820', pct: 0.82 },
    { name: 'UI/UX Design', revenue: '$3,210', pct: 0.62 },
    { name: 'Mobile Development', revenue: '$2,450', pct: 0.48 },
    { name: 'Digital Marketing', revenue: '$1,670', pct: 0.34 },
    { name: 'Graphic Design', revenue: '$1,120', pct: 0.24 }
  ]

  function exportPdf() {
    notify.info('PDF export feature available in production with a PDF library.')
  }
</script>