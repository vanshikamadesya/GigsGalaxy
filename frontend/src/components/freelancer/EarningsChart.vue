<template>
  <div class="earnings-chart">
    <template v-if="loading">
      <div class="chart-skeleton">
        <div v-for="i in 12" :key="i" class="bar-skeleton skeleton" :style="{ height: `${20 + (i * 13) % 80}%` }" />
      </div>
    </template>
    <template v-else-if="data.length">
      <div class="chart-bars">
        <div
          v-for="item in data"
          :key="item.month"
          class="bar-wrap"
          @mouseenter="hoveredItem = item"
          @mouseleave="hoveredItem = null"
        >
          <div class="bar-tooltip" v-if="hoveredItem === item">
            <div class="text-weight-bold">${{ item.earnings }}</div>
            <div class="text-xs">{{ item.orders }} orders</div>
          </div>
          <div class="bar" :style="{ height: getBarHeight(item.earnings) + '%' }" />
          <div class="bar-label">{{ item.month }}</div>
        </div>
      </div>
      <!-- Y axis labels -->
      <div class="y-axis gt-sm">
        <span v-for="v in yAxisValues" :key="v" class="y-label">${{ v }}</span>
      </div>
    </template>
    <div v-else class="empty-chart text-center text-grey-5 q-py-xl">
      <q-icon name="bar_chart" size="48px" class="q-mb-sm" />
      <div>No earnings data yet</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { EarningsChart } from 'src/types'

  const props = defineProps<{ data: EarningsChart[]; loading?: boolean }>()

  const hoveredItem = ref<EarningsChart | null>(null)

  const maxEarnings = computed(() => Math.max(...props.data.map(d => d.earnings), 1))

  const yAxisValues = computed(() => {
    const max = maxEarnings.value
    const step = Math.ceil(max / 4 / 100) * 100
    return [0, step, step * 2, step * 3, step * 4]
  })

  function getBarHeight(earnings: number): number {
    return Math.max((earnings / maxEarnings.value) * 100, 2)
  }
</script>