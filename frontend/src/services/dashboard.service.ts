import api from './api'
import type { DashboardStats, EarningsChart, AdminStats } from 'src/types'

export const dashboardService = {
  getFreelancerStats: () =>
    api.get<DashboardStats>('/dashboard/freelancer/stats').then(r => r.data),

  getFreelancerEarningsChart: (period: 'week' | 'month' | 'year' = 'month') =>
    api.get<EarningsChart[]>(`/dashboard/freelancer/earnings?period=${period}`).then(r => r.data),

  getClientStats: () =>
    api.get<DashboardStats>('/dashboard/client/stats').then(r => r.data),

  getAdminStats: () =>
    api.get<AdminStats>('/dashboard/admin/stats').then(r => r.data),

  getAdminRevenueChart: (period: 'week' | 'month' | 'year' = 'month') =>
    api.get<EarningsChart[]>(`/dashboard/admin/revenue?period=${period}`).then(r => r.data),

  getActivityLogs: (page = 1) =>
    api.get(`/dashboard/activity?page=${page}`).then(r => r.data)
}
