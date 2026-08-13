import api from './api'
import type { User, FreelancerProfile, PortfolioItem, PaginatedResponse, SearchFilters } from 'src/types'
import { buildQueryString } from 'src/utils/helpers'

export const userService = {
  getProfile: (username: string) =>
    api.get<FreelancerProfile>(`/users/${username}/profile`).then(r => r.data),

  getMyProfile: () =>
    api.get<FreelancerProfile>('/users/me/profile').then(r => r.data),

  updateProfile: (formData: FormData) =>
    api.put<FreelancerProfile>('/users/me/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data),

  updateSettings: (payload: Partial<User>) =>
    api.put<User>('/users/me/settings', payload).then(r => r.data),

  getFreelancers: (filters: SearchFilters = {}) =>
    api.get<PaginatedResponse<FreelancerProfile>>(
      `/users/freelancers?${buildQueryString(filters as Record<string, unknown>)}`
    ).then(r => r.data),

  getFeaturedFreelancers: () =>
    api.get<FreelancerProfile[]>('/users/freelancers/featured').then(r => r.data),

  getTopRatedFreelancers: () =>
    api.get<FreelancerProfile[]>('/users/freelancers/top-rated').then(r => r.data),

  bookmarkFreelancer: (userId: string) =>
    api.post(`/users/${userId}/bookmark`).then(r => r.data),

  getBookmarkedFreelancers: () =>
    api.get<FreelancerProfile[]>('/users/bookmarked').then(r => r.data),

  // Portfolio
  getPortfolio: (userId: string) =>
    api.get<PortfolioItem[]>(`/users/${userId}/portfolio`).then(r => r.data),

  addPortfolioItem: (formData: FormData) =>
    api.post<PortfolioItem>('/users/me/portfolio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data),

  updatePortfolioItem: (id: string, formData: FormData) =>
    api.put<PortfolioItem>(`/users/me/portfolio/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data),

  deletePortfolioItem: (id: string) =>
    api.delete(`/users/me/portfolio/${id}`).then(r => r.data),

  // Admin
  getAllUsers: (filters: Record<string, unknown> = {}) =>
    api.get<PaginatedResponse<User>>(`/admin/users?${buildQueryString(filters)}`).then(r => r.data),

  verifyFreelancer: (userId: string) =>
    api.patch(`/admin/users/${userId}/verify`).then(r => r.data),

  blockUser: (userId: string) =>
    api.patch(`/admin/users/${userId}/block`).then(r => r.data),

  unblockUser: (userId: string) =>
    api.patch(`/admin/users/${userId}/unblock`).then(r => r.data),

  deleteUser: (userId: string) =>
    api.delete(`/admin/users/${userId}`).then(r => r.data)
}
