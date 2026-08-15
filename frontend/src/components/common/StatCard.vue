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