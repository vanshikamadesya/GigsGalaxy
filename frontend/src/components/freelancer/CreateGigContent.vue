<template>
  <div class="text-grey-6 q-pa-xl text-center">
    <q-icon name="edit" size="48px" color="grey-4" class="q-mb-md" />
    <div>Edit form is a simplified version of <strong>CreateGigPage</strong>.</div>
    <div>In a full implementation this component receives the gig as props and pre-fills all fields.</div>
    <q-btn class="btn-primary q-mt-lg" no-caps unelevated label="Save Changes" @click="emit('saved')" />
  </div>
</template>

<script setup lang="ts">
  import type { Gig } from 'src/types'

  defineProps<{ initial: Gig }>()
  const emit = defineEmits<{ (e: 'saved'): void }>()
</script>
