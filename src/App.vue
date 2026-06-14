<template>
  <router-view />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useQuasar } from 'quasar'
  import { useUIStore } from 'src/stores/ui.store'

  const $q = useQuasar()
  const uiStore = useUIStore()

  onMounted(() => {
    // Restore dark mode preference
    const savedDark = localStorage.getItem('gg_dark_mode')
    if (savedDark !== null) {
      $q.dark.set(savedDark === 'true')
    }
  })
</script>
