import { defineStore } from 'pinia'
import { ref } from 'vue'
import { gigService } from 'src/services/gig.service'
import type { Gig, PaginatedResponse, SearchFilters } from 'src/types'

export const useGigStore = defineStore('gig', () => {
  const gigs = ref<Gig[]>([])
  const myGigs = ref<Gig[]>([])
  const currentGig = ref<Gig | null>(null)
  const featuredGigs = ref<Gig[]>([])
  const bookmarkedGigs = ref<Gig[]>([])
  const pagination = ref({ total: 0, page: 1, limit: 12, totalPages: 0 })
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchGigs(filters: SearchFilters = {}) {
    loading.value = true
    error.value = null
    try {
      const result: PaginatedResponse<Gig> = await gigService.getGigs(filters)
      gigs.value = result.data
      pagination.value = { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages }
    } catch (err: unknown) {
      const e = err as { message?: string }
      error.value = e.message || 'Failed to load gigs'
    } finally {
      loading.value = false
    }
  }

  async function fetchMyGigs(filters: SearchFilters = {}) {
    loading.value = true
    try {
      const result = await gigService.getMyGigs(filters)
      myGigs.value = result.data
    } catch (err: unknown) {
      const e = err as { message?: string }
      error.value = e.message || 'Failed to load gigs'
    } finally {
      loading.value = false
    }
  }

  async function fetchGigById(id: string) {
    loading.value = true
    try {
      currentGig.value = await gigService.getGigById(id)
    } finally {
      loading.value = false
    }
  }

  async function fetchFeaturedGigs() {
    featuredGigs.value = await gigService.getFeaturedGigs()
  }

  async function createGig(formData: FormData) {
    const newGig = await gigService.createGig(formData)
    myGigs.value.unshift(newGig)
    return newGig
  }

  async function updateGig(id: string, formData: FormData) {
    const updated = await gigService.updateGig(id, formData)
    const idx = myGigs.value.findIndex(g => g.id === id)
    if (idx !== -1) myGigs.value[idx] = updated
    if (currentGig.value?.id === id) currentGig.value = updated
    return updated
  }

  async function deleteGig(id: string) {
    await gigService.deleteGig(id)
    myGigs.value = myGigs.value.filter(g => g.id !== id)
  }

  async function toggleBookmark(gigId: string) {
    await gigService.toggleBookmark(gigId)
    const isBookmarked = bookmarkedGigs.value.some(g => g.id === gigId)
    if (isBookmarked) {
      bookmarkedGigs.value = bookmarkedGigs.value.filter(g => g.id !== gigId)
    } else {
      const gig = gigs.value.find(g => g.id === gigId) || currentGig.value
      if (gig) bookmarkedGigs.value.push(gig)
    }
  }

  return {
    gigs,
    myGigs,
    currentGig,
    featuredGigs,
    bookmarkedGigs,
    pagination,
    loading,
    error,
    fetchGigs,
    fetchMyGigs,
    fetchGigById,
    fetchFeaturedGigs,
    createGig,
    updateGig,
    deleteGig,
    toggleBookmark
  }
})
