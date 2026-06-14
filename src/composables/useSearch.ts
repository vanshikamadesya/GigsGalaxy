import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { debounce } from 'src/utils/helpers'

export function useSearch(onSearch: (query: string) => void, delay = 400) {
  const route = useRoute()
  const router = useRouter()

  const query = ref((route.query.q as string) || '')
  const isSearching = ref(false)

  const debouncedSearch = debounce((q: string) => {
    isSearching.value = false
    onSearch(q)
  }, delay)

  watch(query, newQuery => {
    isSearching.value = true
    debouncedSearch(newQuery)
  })

  function syncToUrl() {
    router.replace({ query: { ...route.query, q: query.value || undefined } })
  }

  function clearSearch() {
    query.value = ''
  }

  return {
    query,
    isSearching,
    clearSearch,
    syncToUrl
  }
}
