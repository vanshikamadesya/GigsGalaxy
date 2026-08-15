<template>
  <q-page class="q-py-xl">
    <div class="page-container">
      <h1 class="text-h5 text-weight-bold q-mb-xl">{{ categoryName }}</h1>
      <div class="row q-col-gutter-xl">
        <div class="col-12 col-md-3">
          <SearchFilters @update="onFilter" />
        </div>
        <div class="col-12 col-md-9">
          <div v-if="loading" class="gigs-grid">
            <q-card v-for="i in 6" :key="i" class="gg-card">
              <div class="skeleton" style="height:160px" />
              <q-card-section><div class="skeleton" style="height:14px;width:80%" /></q-card-section>
            </q-card>
          </div>
          <div v-else class="gigs-grid">
            <GigCard v-for="gig in gigs" :key="gig.id" :gig="gig" />
          </div>
          <div v-if="!loading && !gigs.length" class="text-center q-py-3xl text-grey-5">
            <q-icon name="search_off" size="64px" class="q-mb-md" />
            <p>No gigs in this category yet.</p>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { gigService } from 'src/services/gig.service'
  import { CATEGORIES } from 'src/utils/constants'
  import type { Gig, SearchFilters as SearchFiltersType } from 'src/types'
  import GigCard from 'src/components/common/GigCard.vue'
  import SearchFilters from 'src/components/common/SearchFilters.vue'

  const route = useRoute()
  const gigs = ref<Gig[]>([])
  const loading = ref(true)
  const activeFilters = ref<SearchFiltersType>({})

  const categoryName = computed(() => {
    const slug = route.params.slug as string
    return CATEGORIES.find(c => c.slug === slug)?.name || slug
  })

  async function load(filters: SearchFiltersType = {}) {
    loading.value = true
    try {
      const res = await gigService.getGigs({ category: route.params.slug as string, ...filters })
      gigs.value = res.data
    } finally {
      loading.value = false
    }
  }

  function onFilter(f: SearchFiltersType) {
    activeFilters.value = f
    load(f)
  }

  onMounted(() => load())
</script>