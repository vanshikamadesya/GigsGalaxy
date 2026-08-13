<template>
  <q-page class="q-py-xl">
    <div class="page-container">
      <!-- Header -->
      <div class="q-mb-xl text-center">
        <h1 class="text-h4 text-weight-bold q-mb-sm">Find Top Freelancers</h1>
        <p class="text-grey-6">Browse verified professionals from around the world</p>
      </div>

      <div class="row q-col-gutter-xl">
        <!-- Filters -->
        <div class="col-12 col-md-3">
          <SearchFilters @update="onFilter" />
        </div>

        <!-- List -->
        <div class="col-12 col-md-9">
          <!-- Sort + View toggle -->
          <div class="row items-center justify-between q-mb-lg">
            <div class="text-grey-6 text-sm">{{ total }} freelancers found</div>
            <div class="row q-gutter-sm">
              <q-select
                v-model="sort"
                :options="sortOptions"
                dense outlined emit-value map-options
                style="width:180px"
                @update:model-value="reload"
              />
              <q-btn-toggle
                v-model="viewMode"
                dense flat
                :options="[{icon:'grid_view', value:'grid'},{icon:'view_list', value:'list'}]"
                toggle-color="primary"
              />
            </div>
          </div>

          <!-- Skeleton -->
          <div v-if="loading" class="freelancers-grid">
            <q-card v-for="i in 8" :key="i" class="gg-card q-pa-lg">
              <div class="skeleton q-mb-md" style="width:72px;height:72px;border-radius:50%;margin:0 auto" />
              <div class="skeleton q-mb-sm" style="height:14px;width:70%;margin:0 auto" />
              <div class="skeleton" style="height:12px;width:50%;margin:0 auto" />
            </q-card>
          </div>

          <!-- Grid -->
          <div v-else-if="viewMode === 'grid'" class="freelancers-grid">
            <FreelancerCard
              v-for="fl in freelancers"
              :key="fl.id"
              :profile="fl"
              :online-users="chatStore.onlineUsers"
            />
          </div>

          <!-- Empty -->
          <div v-if="!loading && !freelancers.length" class="text-center q-py-3xl">
            <q-icon name="person_search" size="64px" color="grey-4" class="q-mb-md" />
            <p class="text-grey-6">No freelancers found matching your criteria.</p>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="row justify-center q-mt-xl">
            <q-pagination v-model="page" :max="totalPages" direction-links boundary-links color="primary" @update:model-value="reload" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useChatStore } from 'src/stores/chat.store'
  import { userService } from 'src/services/user.service'
  import type { FreelancerProfile, SearchFilters as SearchFiltersType } from 'src/types'
  import FreelancerCard from 'src/components/common/FreelancerCard.vue'
  import SearchFilters from 'src/components/common/SearchFilters.vue'

  const chatStore = useChatStore()
  const loading = ref(true)
  const freelancers = ref<FreelancerProfile[]>([])
  const total = ref(0)
  const totalPages = ref(1)
  const page = ref(1)
  const viewMode = ref<'grid' | 'list'>('grid')
  const sort = ref('rating')
  const filters = ref<SearchFiltersType>({})

  const sortOptions = [
    { label: 'Top Rated', value: 'rating' },
    { label: 'Most Projects', value: 'projects' },
    { label: 'Rate: Low to High', value: 'rate_asc' },
    { label: 'Rate: High to Low', value: 'rate_desc' }
  ]

  async function reload() {
    loading.value = true
    try {
      const res = await userService.getFreelancers({ ...filters.value, page: page.value, sortBy: sort.value as SearchFiltersType['sortBy'] })
      freelancers.value = res.data
      total.value = res.total
      totalPages.value = res.totalPages
    } finally {
      loading.value = false
    }
  }

  function onFilter(f: SearchFiltersType) {
    filters.value = f
    page.value = 1
    reload()
  }

  onMounted(reload)
</script>

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;

  .freelancers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-lg;
    @media (max-width: $bp-lg)  { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: $bp-sm)  { grid-template-columns: 1fr; }
  }
</style>
