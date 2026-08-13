import { ref, computed } from 'vue'

export function usePagination(defaultLimit = 12) {
  const page = ref(1)
  const limit = ref(defaultLimit)
  const total = ref(0)
  const loading = ref(false)

  const totalPages = computed(() => Math.ceil(total.value / limit.value))
  const hasNextPage = computed(() => page.value < totalPages.value)
  const hasPrevPage = computed(() => page.value > 1)

  function nextPage() {
    if (hasNextPage.value) page.value++
  }

  function prevPage() {
    if (hasPrevPage.value) page.value--
  }

  function goToPage(p: number) {
    if (p >= 1 && p <= totalPages.value) page.value = p
  }

  function reset() {
    page.value = 1
    total.value = 0
  }

  return {
    page,
    limit,
    total,
    totalPages,
    loading,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
    reset
  }
}
