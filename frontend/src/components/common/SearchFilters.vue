<template>
  <q-card class="gg-card filter-card q-pa-md">
    <div class="filter-header row items-center justify-between q-mb-md">
      <div class="text-weight-bold text-subtitle2">Filters</div>
      <q-btn flat dense no-caps size="sm" label="Reset All" color="primary" @click="reset" />
    </div>

    <!-- Category -->
    <div class="filter-section q-mb-md">
      <div class="filter-label">Category</div>
      <q-select
        v-model="filters.category"
        :options="categoryOptions"
        dense outlined clearable
        placeholder="All Categories"
        emit-value map-options
        @update:model-value="emit('update', filters)"
      />
    </div>

    <!-- Price Range -->
    <div class="filter-section q-mb-md">
      <div class="filter-label">Budget</div>
      <div class="row q-gutter-sm">
        <q-input
          v-model.number="filters.priceMin"
          dense outlined type="number" placeholder="Min $"
          class="col"
          @update:model-value="emit('update', filters)"
        >
          <template #prepend><span class="text-grey-6 text-sm">$</span></template>
        </q-input>
        <q-input
          v-model.number="filters.priceMax"
          dense outlined type="number" placeholder="Max $"
          class="col"
          @update:model-value="emit('update', filters)"
        >
          <template #prepend><span class="text-grey-6 text-sm">$</span></template>
        </q-input>
      </div>
    </div>

    <!-- Rating -->
    <div class="filter-section q-mb-md">
      <div class="filter-label">Minimum Rating</div>
      <div class="row q-gutter-sm">
        <q-btn
          v-for="r in [1, 2, 3, 4, 5]"
          :key="r"
          dense flat no-caps
          :label="`${r}+★`"
          size="sm"
          :color="filters.rating === r ? 'warning' : 'grey-5'"
          :unelevated="filters.rating === r"
          class="rating-btn"
          @click="setRating(r)"
        />
      </div>
    </div>

    <!-- Delivery Time -->
    <div class="filter-section q-mb-md">
      <div class="filter-label">Delivery Time</div>
      <q-select
        v-model="filters.deliveryTime"
        :options="deliveryOptions"
        dense outlined clearable
        placeholder="Any"
        emit-value map-options
        @update:model-value="emit('update', filters)"
      />
    </div>

    <!-- Country -->
    <div class="filter-section q-mb-md">
      <div class="filter-label">Seller Country</div>
      <q-select
        v-model="filters.country"
        :options="COUNTRIES"
        dense outlined clearable
        use-input input-debounce="200"
        placeholder="Any Country"
        @update:model-value="emit('update', filters)"
      />
    </div>

    <!-- Sort -->
    <div class="filter-section">
      <div class="filter-label">Sort By</div>
      <q-select
        v-model="filters.sortBy"
        :options="sortOptions"
        dense outlined
        emit-value map-options
        @update:model-value="emit('update', filters)"
      />
    </div>
  </q-card>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { CATEGORIES, COUNTRIES } from 'src/utils/constants'
  import type { SearchFilters } from 'src/types'

  const emit = defineEmits<{ (e: 'update', filters: SearchFilters): void }>()

  const filters = reactive<SearchFilters>({
    category: undefined,
    priceMin: undefined,
    priceMax: undefined,
    rating: undefined,
    deliveryTime: undefined,
    country: undefined,
    sortBy: 'relevance'
  })

  const categoryOptions = CATEGORIES.map(c => ({ label: c.name, value: c.slug }))

  const deliveryOptions = [
    { label: 'Express (24h)', value: 1 },
    { label: 'Up to 3 days', value: 3 },
    { label: 'Up to 7 days', value: 7 },
    { label: 'Up to 14 days', value: 14 },
    { label: 'Up to 30 days', value: 30 }
  ]

  const sortOptions = [
    { label: 'Most Relevant', value: 'relevance' },
    { label: 'Best Rating', value: 'rating' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Newest First', value: 'newest' }
  ]

  function setRating(r: number) {
    filters.rating = filters.rating === r ? undefined : r
    emit('update', filters)
  }

  function reset() {
    Object.assign(filters, { category: undefined, priceMin: undefined, priceMax: undefined, rating: undefined, deliveryTime: undefined, country: undefined, sortBy: 'relevance' })
    emit('update', filters)
  }
</script>

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;

  .filter-card { position: sticky; top: 80px; }
  .filter-label { font-size: $font-size-xs; font-weight: 600; color: $text-muted; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: $spacing-xs; }
  .rating-btn { border-radius: $radius-sm !important; }
</style>
