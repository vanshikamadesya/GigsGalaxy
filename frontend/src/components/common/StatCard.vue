<template>
  <q-card class="stat-card gg-card" :class="`stat-card--${color}`">
    <q-card-section class="stat-body">
      <div class="stat-icon-wrap">
        <q-icon :name="icon" size="28px" :color="color" />
      </div>
      <div class="stat-content">
        <div class="stat-value">
          <template v-if="loading">
            <div class="skeleton" style="width:80px;height:28px;border-radius:6px" />
          </template>
          <span v-else>{{ formattedValue }}</span>
        </div>
        <div class="stat-label">{{ label }}</div>
        <div v-if="trend !== undefined" class="stat-trend" :class="trend >= 0 ? 'trend-up' : 'trend-down'">
          <q-icon :name="trend >= 0 ? 'trending_up' : 'trending_down'" size="14px" />
          <span>{{ Math.abs(trend) }}% {{ trend >= 0 ? 'up' : 'down' }} this month</span>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { formatCurrency, formatNumber } from 'src/utils/helpers'

  const props = withDefaults(defineProps<{
    label: string
    value: number | string
    icon: string
    color?: string
    type?: 'number' | 'currency' | 'text'
    trend?: number
    loading?: boolean
  }>(), {
    color: 'primary',
    type: 'number',
    loading: false
  })

  const formattedValue = computed(() => {
    if (typeof props.value === 'string') return props.value
    if (props.type === 'currency') return formatCurrency(props.value)
    if (props.type === 'number') return formatNumber(props.value)
    return props.value
  })
</script>

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;

  .stat-card {
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -20px;
      right: -20px;
      width: 90px;
      height: 90px;
      border-radius: 50%;
      opacity: 0.06;
    }

    &--primary::before { background: $primary; }
    &--secondary::before { background: $secondary; }
    &--positive::before, &--success::before { background: $success; }
    &--warning::before { background: $warning; }
    &--accent::before { background: $accent; }
  }

  .stat-body {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-lg !important;
  }

  .stat-icon-wrap {
    width: 56px;
    height: 56px;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(91, 33, 182, 0.08);
    flex-shrink: 0;
  }

  .stat-content { flex: 1; }

  .stat-value {
    font-size: $font-size-2xl;
    font-weight: 700;
    color: $text-primary;
    line-height: 1.2;
    .body--dark & { color: white; }
  }

  .stat-label {
    font-size: $font-size-sm;
    color: $text-muted;
    margin-top: 2px;
  }

  .stat-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: $font-size-xs;
    margin-top: 6px;

    &.trend-up { color: $success; }
    &.trend-down { color: $danger; }
  }
</style>
