import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const leftDrawerOpen = ref(false)
  const rightDrawerOpen = ref(false)
  const searchQuery = ref('')
  const globalLoading = ref(false)
  const isDark = ref(false)
  const locale = ref('en-US')
  const drawerMini = ref(false)

  function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }

  function toggleRightDrawer() {
    rightDrawerOpen.value = !rightDrawerOpen.value
  }

  function toggleDrawerMini() {
    drawerMini.value = !drawerMini.value
  }

  function setLocale(loc: string) {
    locale.value = loc
    localStorage.setItem('gg_locale', loc)
  }

  function initDarkMode() {
    const saved = localStorage.getItem('gg_dark_mode')
    isDark.value = saved === 'true'
  }

  return {
    leftDrawerOpen,
    rightDrawerOpen,
    searchQuery,
    globalLoading,
    isDark,
    locale,
    drawerMini,
    toggleLeftDrawer,
    toggleRightDrawer,
    toggleDrawerMini,
    setLocale,
    initDarkMode
  }
})
