import api from './api'
import type { Review, PaginatedResponse } from 'src/types'

export const reviewService = {
  getFreelancerReviews: (freelancerId: string, page = 1) =>
    api.get<PaginatedResponse<Review>>(`/reviews/freelancer/${freelancerId}?page=${page}`).then(r => r.data),

  getGigReviews: (gigId: string, page = 1) =>
    api.get<PaginatedResponse<Review>>(`/reviews/gig/${gigId}?page=${page}`).then(r => r.data),

  getMyReviews: () =>
    api.get<Review[]>('/reviews/my').then(r => r.data),

  createReview: (payload: { orderId: string; rating: number; comment: string }) =>
    api.post<Review>('/reviews', payload).then(r => r.data),

  replyToReview: (reviewId: string, reply: string) =>
    api.post(`/reviews/${reviewId}/reply`, { reply }).then(r => r.data),

  deleteReview: (reviewId: string) =>
    api.delete(`/reviews/${reviewId}`).then(r => r.data)
}
