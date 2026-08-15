<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h1 class="text-h5 text-weight-bold q-mb-xs">My Gigs</h1>
        <p class="text-grey-6">Manage your service listings</p>
      </div>
      <q-btn unelevated no-caps to="/freelancer/gigs/create" label="Create New Gig" icon="add" class="btn-primary" />
    </div>

    <!-- Filters -->
    <div class="row q-gutter-sm q-mb-lg">
      <q-btn-toggle v-model="statusFilter" dense flat :options="statusOptions" toggle-color="primary" @update:model-value="filterGigs" />
      <q-space />
      <q-input v-model="search" dense outlined placeholder="Search gigs..." style="width:220px" @update:model-value="filterGigs">
        <template #prepend><q-icon name="search" size="16px" /></template>
      </q-input>
    </div>

    <!-- Skeleton -->
    <div v-if="gigStore.loading" class="gigs-manage-grid">
      <q-card v-for="i in 6" :key="i" class="gg-card">
        <div class="skeleton" style="height:140px" />
        <q-card-section><div class="skeleton" style="height:14px;width:80%" /></q-card-section>
      </q-card>
    </div>

    <!-- Grid -->
    <div v-else-if="filteredGigs.length" class="gigs-manage-grid">
      <q-card v-for="gig in filteredGigs" :key="gig.id" class="gg-card gig-manage-card">
        <div class="gig-manage-image">
          <q-img :src="gig.images[0] || 'https://placehold.co/400x220/5B21B6/white?text=Gig'" :ratio="16/9" />
          <q-badge :color="GIG_STATUS_COLORS[gig.status]" class="gig-status-badge">{{ gig.status }}</q-badge>
        </div>
        <q-card-section>
          <div class="text-weight-bold q-mb-xs text-sm" style="line-height:1.4">{{ truncate(gig.title, 50) }}</div>
          <div class="row items-center q-gutter-sm q-mb-sm">
            <StarRating :rating="gig.averageRating" :count="gig.totalReviews" size="12px" />
          </div>
          <div class="row items-center justify-between">
            <span class="text-primary text-weight-bold">${{ Math.min(...gig.packages.map(p => p.price)) }}</span>
            <span class="text-xs text-grey-6">{{ gig.totalOrders }} orders</span>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions class="q-pa-sm">
          <q-btn flat dense no-caps size="sm" icon="edit" label="Edit" color="primary" :to="`/freelancer/gigs/${gig.id}/edit`" />
          <q-btn
            flat dense no-caps size="sm"
            :icon="gig.status === 'published' ? 'visibility_off' : 'publish'"
            :label="gig.status === 'published' ? 'Unpublish' : 'Publish'"
            :color="gig.status === 'published' ? 'grey' : 'positive'"
            @click="togglePublish(gig)"
          />
          <q-space />
          <q-btn flat dense size="sm" icon="open_in_new" color="grey-6" :to="`/gigs/${gig.id}`" />
          <q-btn flat dense size="sm" icon="delete_outline" color="negative" @click="deleteGig(gig)" />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Empty -->
    <div v-else class="text-center q-py-3xl">
      <q-icon name="work_outline" size="72px" color="grey-4" class="q-mb-lg" />
      <h3 class="text-grey-6 q-mb-sm">No gigs yet</h3>
      <p class="text-grey-5 q-mb-lg">Create your first gig and start earning!</p>
      <q-btn unelevated no-caps to="/freelancer/gigs/create" label="Create Your First Gig" class="btn-primary q-px-xl" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useGigStore } from 'src/stores/gig.store'
  import { useNotify } from 'src/composables/useNotify'
  import { truncate } from 'src/utils/helpers'
  import { GIG_STATUS_COLORS } from 'src/utils/constants'
  import type { Gig } from 'src/types'
  import StarRating from 'src/components/common/StarRating.vue'

  const gigStore = useGigStore()
  const notify = useNotify()

  const statusFilter = ref('all')
  const search = ref('')

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
    { label: 'Pending Review', value: 'pending_review' }
  ]

  const filteredGigs = computed(() => {
    let list = gigStore.myGigs
    if (statusFilter.value !== 'all') list = list.filter(g => g.status === statusFilter.value)
    if (search.value) list = list.filter(g => g.title.toLowerCase().includes(search.value.toLowerCase()))
    return list
  })

  function filterGigs() { /* reactive via computed */ }

  async function togglePublish(gig: Gig) {
    try {
      if (gig.status === 'published') {
        await gigStore.updateGig(gig.id, (() => { const fd = new FormData(); fd.append('status', 'draft'); return fd })())
      } else {
        await gigStore.updateGig(gig.id, (() => { const fd = new FormData(); fd.append('status', 'published'); return fd })())
      }
      notify.success('Gig status updated')
    } catch {
      notify.error('Failed to update gig')
    }
  }

  async function deleteGig(gig: Gig) {
    notify.confirmDelete(gig.title, async () => {
      try {
        await gigStore.deleteGig(gig.id)
        notify.success('Gig deleted')
      } catch {
        notify.error('Failed to delete gig')
      }
    })
  }

  onMounted(() => gigStore.fetchMyGigs())
</script>