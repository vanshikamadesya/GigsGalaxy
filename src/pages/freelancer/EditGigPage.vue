<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-xl">
      <q-btn flat round icon="arrow_back" to="/freelancer/gigs" class="q-mr-sm" />
      <h1 class="text-h5 text-weight-bold">Edit Gig</h1>
    </div>
    <div v-if="gigStore.loading" class="skeleton" style="height:500px;border-radius:16px" />
    <div v-else-if="gigStore.currentGig">
      <CreateGigContent :initial="gigStore.currentGig" @saved="onSaved" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useGigStore } from 'src/stores/gig.store'
  import { useNotify } from 'src/composables/useNotify'
  // Reuse the form as a component; for brevity we redirect to create page with gig data
  import CreateGigContent from 'src/components/freelancer/CreateGigContent.vue'

  const route = useRoute()
  const router = useRouter()
  const gigStore = useGigStore()
  const notify = useNotify()

  function onSaved() {
    notify.success('Gig updated!')
    router.push('/freelancer/gigs')
  }

  onMounted(() => gigStore.fetchGigById(route.params.id as string))
</script>
