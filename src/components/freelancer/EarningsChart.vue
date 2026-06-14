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

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;

  .earnings-chart {
    position: relative;
    height: 100%;
    display: flex;
    gap: $spacing-md;
  }

  .chart-skeleton {
    flex: 1;
    display: flex;
    align-items: flex-end;
    gap: 8px;
    padding-bottom: 24px;
  }

  .bar-skeleton {
    flex: 1;
    border-radius: $radius-sm $radius-sm 0 0;
    animation: skeleton-wave 1.5s infinite;
  }

  .chart-bars {
    flex: 1;
    display: flex;
    align-items: flex-end;
    gap: 6px;
    padding-bottom: 24px;
    position: relative;
  }

  .bar-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    position: relative;
    cursor: pointer;
  }

  .bar-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #1a1a2e;
    color: white;
    padding: 6px 10px;
    border-radius: $radius-sm;
    font-size: $font-size-xs;
    white-space: nowrap;
    z-index: 10;
    margin-bottom: 4px;
    pointer-events: none;
  }

  .bar {
    width: 100%;
    background: $gradient-primary;
    border-radius: $radius-sm $radius-sm 0 0;
    min-height: 4px;
    transition: all $transition-base;
    position: absolute;
    bottom: 24px;

    &:hover { filter: brightness(1.1); }
  }

  .bar-label {
    position: absolute;
    bottom: 0;
    font-size: 10px;
    color: $text-muted;
    white-space: nowrap;
  }

  .y-axis {
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-between;
    padding-bottom: 24px;
    font-size: 10px;
    color: $text-muted;
    min-width: 40px;
    text-align: right;
  }
</style>
