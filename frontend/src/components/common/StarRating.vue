<template>
  <div class="star-rating-wrap row items-center q-gutter-xs">
    <div class="stars row">
      <q-icon
        v-for="i in 5"
        :key="i"
        :name="i <= Math.floor(rating) ? 'star' : i - 0.5 <= rating ? 'star_half' : 'star_border'"
        :size="size"
        :color="i <= rating ? 'warning' : 'grey-4'"
      />
    </div>
    <span v-if="showValue" class="rating-value text-weight-bold" :style="`font-size:${size}`">
      {{ rating.toFixed(1) }}
    </span>
    <span v-if="count !== undefined" class="rating-count text-grey-6 text-sm">
      ({{ count }})
    </span>
  </div>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{
    rating: number
    count?: number
    size?: string
    showValue?: boolean
  }>(), {
    size: '16px',
    showValue: false
  })
</script>