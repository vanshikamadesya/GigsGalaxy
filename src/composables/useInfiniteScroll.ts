import { ref } from 'vue'

export function useInfiniteScroll<T>(
  fetcher: (page: number) => Promise<{ data: T[]; totalPages: number }>
) {
  const items = ref<T[]>([]) as { value: T[] }
  const page = ref(1)
  const loading = ref(false)
  const finished = ref(false)
  const error = ref<string | null>(null)

  async function load(index: number, done: (stop?: boolean) => void) {
    if (finished.value) {
      done(true)
      return
    }
    loading.value = true
    error.value = null
    try {
      const result = await fetcher(page.value)
      items.value.push(...result.data)
      if (page.value >= result.totalPages) {
        finished.value = true
        done(true)
      } else {
        page.value++
        done()
      }
    } catch (err: unknown) {
      const e = err as { message?: string }
      error.value = e.message || 'Failed to load'
      done(true)
    } finally {
      loading.value = false
    }
  }

  function reset() {
    items.value = []
    page.value = 1
    finished.value = false
    error.value = null
  }

  return { items, loading, finished, error, load, reset }
}
