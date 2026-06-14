import api from './api'
import type { Gig, PaginatedResponse, SearchFilters } from 'src/types'
import { buildQueryString } from 'src/utils/helpers'

export const gigService = {
  getGigs: (filters: SearchFilters = {}) =>
    api.get<PaginatedResponse<Gig>>(`/gigs?${buildQueryString(filters as Record<string, unknown>)}`).then(r => r.data),

  getGigById: (id: string) =>
    api.get<Gig>(`/gigs/${id}`).then(r => r.data),

  getMyGigs: (filters: SearchFilters = {}) =>
    api.get<PaginatedResponse<Gig>>(`/gigs/my?${buildQueryString(filters as Record<string, unknown>)}`).then(r => r.data),

  createGig: (formData: FormData) =>
    api.post<Gig>('/gigs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data),

  updateGig: (id: string, formData: FormData) =>
    api.put<Gig>(`/gigs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data),

  deleteGig: (id: string) =>
    api.delete(`/gigs/${id}`).then(r => r.data),

  publishGig: (id: string) =>
    api.patch<Gig>(`/gigs/${id}/publish`).then(r => r.data),

  draftGig: (id: string) =>
    api.patch<Gig>(`/gigs/${id}/draft`).then(r => r.data),

  getFeaturedGigs: () =>
    api.get<Gig[]>('/gigs/featured').then(r => r.data),

  searchGigs: (query: string, filters: SearchFilters = {}) =>
    api.get<PaginatedResponse<Gig>>(`/gigs/search?q=${encodeURIComponent(query)}&${buildQueryString(filters as Record<string, unknown>)}`).then(r => r.data),

  getRelatedGigs: (gigId: string) =>
    api.get<Gig[]>(`/gigs/${gigId}/related`).then(r => r.data),

  toggleBookmark: (gigId: string) =>
    api.post(`/gigs/${gigId}/bookmark`).then(r => r.data),

  getBookmarkedGigs: () =>
    api.get<Gig[]>('/gigs/bookmarked').then(r => r.data),

  // Admin
  approveGig: (id: string) =>
    api.patch(`/admin/gigs/${id}/approve`).then(r => r.data),

  rejectGig: (id: string, reason: string) =>
    api.patch(`/admin/gigs/${id}/reject`, { reason }).then(r => r.data),

  getPendingGigs: () =>
    api.get<PaginatedResponse<Gig>>('/admin/gigs/pending').then(r => r.data)
}
