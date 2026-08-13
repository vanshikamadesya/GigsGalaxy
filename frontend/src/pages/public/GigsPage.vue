<template>
  <q-page class="q-py-xl">
    <div class="page-container">
      <div class="row q-col-gutter-xl">
        <!-- Filters sidebar -->
        <div class="col-12 col-md-3">
          <SearchFilters @update="onFiltersUpdate" />
        </div>

        <!-- Main content -->
        <div class="col-12 col-md-9">
          <!-- Header bar -->
          <div class="results-bar row items-center justify-between q-mb-lg">
            <div>
              <h1 class="text-h5 text-weight-bold q-mb-xs">Browse Gigs</h1>
              <div class="text-grey-6 text-sm">{{ gigStore.pagination.total }} results found</div>
            </div>
            <div class="row items-center q-gutter-sm">
              <q-btn-toggle
                v-model="viewMode"
                dense flat
                :options="[{icon:'grid_view', value:'grid'}, {icon:'view_list', value:'list'}]"
                toggle-color="primary"
              />
            </div>
          </div>

          <!-- Skeletons -->
          <div v-if="gigStore.loading" :class="viewMode === 'grid' ? 'gigs-grid' : 'gigs-list'">
            <q-card v-for="i in 8" :key="i" class="gg-card">
              <div class="skeleton" :style="viewMode === 'grid' ? 'height:160px' : 'height:100px'" />
              <q-card-section>
                <div class="skeleton q-mb-sm" style="height:14px;width:90%" />
                <div class="skeleton" style="height:12px;width:60%" />
              </q-card-section>
            </q-card>
          </div>

          <!-- Grid View -->
          <div v-else-if="viewMode === 'grid'" class="gigs-grid">
            <GigCard v-for="gig in gigStore.gigs" :key="gig.id" :gig="gig" />
          </div>

          <!-- List View -->
          <div v-else class="gigs-list">
            <GigListItem v-for="gig in gigStore.gigs" :key="gig.id" :gig="gig" />
          </div>

          <!-- Empty state -->
          <div v-if="!gigStore.loading && !gigStore.gigs.length" class="empty-state text-center q-py-3xl">
            <q-icon name="search_off" size="64px" color="grey-4" class="q-mb-md" />
            <h3 class="text-grey-6 q-mb-sm">No gigs found</h3>
            <p class="text-grey-5">Try adjusting your filters or search query.</p>
          </div>

          <!-- Pagination -->
          <div v-if="gigStore.pagination.totalPages > 1" class="row justify-center q-mt-xl">
            <q-pagination
              v-model="currentPage"
              :max="gigStore.pagination.totalPages"
              direction-links
              boundary-links
              color="primary"
              @update:model-value="onPageChange"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useGigStore } from 'src/stores/gig.store'
  import type { SearchFilters as SearchFiltersType } from 'src/types'
  import GigCard from 'src/components/common/GigCard.vue'
  import GigListItem from 'src/components/common/GigListItem.vue'
  import SearchFilters from 'src/components/common/SearchFilters.vue'

  const route = useRoute()
  const gigStore = useGigStore()

  const viewMode = ref<'grid' | 'list'>('grid')
  const currentPage = ref(1)
  const activeFilters = ref<SearchFiltersType>({})

  async function onFiltersUpdate(filters: SearchFiltersType) {
    activeFilters.value = filters
    currentPage.value = 1
    await gigStore.fetchGigs({ ...filters, page: 1 })
  }

  async function onPageChange(page: number) {
    await gigStore.fetchGigs({ ...activeFilters.value, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(() => {
    const q = route.query.q as string
    gigStore.fetchGigs({ query: q, page: 1 })
  })
</script>

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;

  .gigs-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-lg;
    @media (max-width: $bp-lg)  { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: $bp-sm)  { grid-template-columns: 1fr; }
  }

  .gigs-list { display: flex; flex-direction: column; gap: $spacing-md; }
</style>
