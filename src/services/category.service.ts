import api from './api'
import type { Category } from 'src/types'

export const categoryService = {
  getCategories: () =>
    api.get<Category[]>('/categories').then(r => r.data),

  getCategoryBySlug: (slug: string) =>
    api.get<Category>(`/categories/${slug}`).then(r => r.data),

  // Admin
  createCategory: (payload: Partial<Category>) =>
    api.post<Category>('/admin/categories', payload).then(r => r.data),

  updateCategory: (id: string, payload: Partial<Category>) =>
    api.put<Category>(`/admin/categories/${id}`, payload).then(r => r.data),

  deleteCategory: (id: string) =>
    api.delete(`/admin/categories/${id}`).then(r => r.data)
}
