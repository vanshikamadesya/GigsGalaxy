<template>
  <q-page class="q-py-xl">
    <div class="page-container">
      <!-- Search input -->
      <div class="q-mb-xl">
        <q-input
          v-model="searchQuery"
          outlined dense
          placeholder="Search gigs, freelancers, skills..."
          style="max-width:600px"
          @keyup.enter="doSearch"
        >
          <template #prepend><q-icon name="search" /></template>
          <template #append>
            <q-btn flat dense no-caps label="Search" color="primary" @click="doSearch" />
          </template>
        </q-input>
      </div>

      <!-- Tabs -->
      <q-tabs v-model="tab" class="q-mb-lg" active-color="primary" indicator-color="primary" align="left">
        <q-tab name="gigs" :label="`Gigs (${gigResults.length})`" />
        <q-tab name="freelancers" :label="`Freelancers (${freelancerResults.length})`" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="gigs" class="q-pa-none">
          <div v-if="loadingGigs" class="gigs-grid">
            <q-card v-for="i in 6" :key="i" class="gg-card"><div class="skeleton" style="height:160px" /></q-card>
          </div>
          <div v-else class="gigs-grid">
            <GigCard v-for="gig in gigResults" :key="gig.id" :gig="gig" />
          </div>
          <div v-if="!loadingGigs && !gigResults.length" class="text-center q-py-3xl text-grey-5">No gigs found for "{{ searchQuery }}"</div>
        </q-tab-panel>

        <q-tab-panel name="freelancers" class="q-pa-none">
          <div v-if="loadingFreelancers" class="freelancers-grid">
            <q-card v-for="i in 6" :key="i" class="gg-card q-pa-lg">
              <div class="skeleton q-mb-md" style="width:72px;height:72px;border-radius:50%;margin:0 auto" />
            </q-card>
          </div>
          <div v-else class="freelancers-grid">
            <FreelancerCard v-for="fl in freelancerResults" :key="fl.id" :profile="fl" />
          </div>
          <div v-if="!loadingFreelancers && !freelancerResults.length" class="text-center q-py-3xl text-grey-5">No freelancers found for "{{ searchQuery }}"</div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { gigService } from 'src/services/gig.service'
  import { userService } from 'src/services/user.service'
  import type { Gig, FreelancerProfile } from 'src/types'
  import GigCard from 'src/components/common/GigCard.vue'
  import FreelancerCard from 'src/components/common/FreelancerCard.vue'

  const route = useRoute()
  const router = useRouter()

  const tab = ref('gigs')
  const searchQuery = ref((route.query.q as string) || '')
  const loadingGigs = ref(false)
  const loadingFreelancers = ref(false)
  const gigResults = ref<Gig[]>([])
  const freelancerResults = ref<FreelancerProfile[]>([])

  function doSearch() {
    if (searchQuery.value.trim()) {
      router.replace({ query: { q: searchQuery.value } })
      runSearch()
    }
  }

  async function runSearch() {
    const q = searchQuery.value.trim()
    if (!q) return
    loadingGigs.value = true
    loadingFreelancers.value = true
    const [gigsRes, flRes] = await Promise.all([
      gigService.getGigs({ query: q }).finally(() => { loadingGigs.value = false }),
      userService.getFreelancers({ query: q }).finally(() => { loadingFreelancers.value = false })
    ])
    gigResults.value = gigsRes.data
    freelancerResults.value = flRes.data
  }

  onMounted(runSearch)
  watch(() => route.query.q, (q) => { searchQuery.value = q as string; runSearch() })
</script>