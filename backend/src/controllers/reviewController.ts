import { Response } from 'express'
import Review from '../models/Review'
import Order from '../models/Order'
import User from '../models/User'
import { AuthRequest } from '../middleware/auth'
import { paginated } from '../utils/pagination'
import { formatReview } from '../utils/serializers'
import { createNotification } from '../utils/notifications'

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, rating, comment } = req.body
    const order = await Order.findById(orderId).populate('gig')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (order.buyer.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    if (order.status !== 'completed' && order.status !== 'delivered') {
      return res.status(400).json({ message: 'Order must be delivered or completed to review' })
    }

    const existing = await Review.findOne({ order: orderId, reviewer: req.user?.id })
    if (existing) {
      return res.status(409).json({ message: 'Review already submitted' })
    }

    const review = new Review({
      order: orderId,
      gig: order.gig,
      reviewer: req.user?.id,
      reviewee: order.seller,
      rating,
      comment,
      type: 'buyer'
    })
    await review.save()
    await review.populate('reviewer')

    const reviews = await Review.find({ reviewee: order.seller, type: 'buyer' })
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    await User.findByIdAndUpdate(order.seller, {
      averageRating: avg,
      totalReviews: reviews.length,
      rating: avg
    })

    await createNotification(
      order.seller.toString(),
      'review_received',
      'New Review',
      `You received a ${rating}-star review`,
      `/freelancer/reviews`
    )

    res.status(201).json(formatReview(review))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getFreelancerReviews = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    const reviews = await Review.find({
      reviewee: req.params.freelancerId,
      type: 'buyer'
    })
      .populate('reviewer')
      .populate('gig')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
    const total = await Review.countDocuments({
      reviewee: req.params.freelancerId,
      type: 'buyer'
    })
    res.json(paginated(reviews.map(r => formatReview(r)), total, page, limit))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getGigReviews = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    const reviews = await Review.find({ gig: req.params.gigId })
      .populate('reviewer')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
    const total = await Review.countDocuments({ gig: req.params.gigId })
    res.json(paginated(reviews.map(r => formatReview(r)), total, page, limit))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyReviews = async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await Review.find({ reviewee: req.user?.id, type: 'buyer' })
      .populate('reviewer')
      .populate('gig')
      .sort({ createdAt: -1 })
    res.json(reviews.map(r => formatReview(r)))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const replyToReview = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.reviewId || req.params.id)
    if (!review) return res.status(404).json({ message: 'Review not found' })
    if (review.reviewee.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    review.reply = req.body.reply
    review.repliedAt = new Date()
    await review.save()
    await review.populate('reviewer')
    res.json(formatReview(review))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return res.status(404).json({ message: 'Review not found' })
    if (review.reviewer.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' })
    }
    await Review.deleteOne({ _id: req.params.id })
    res.json({ message: 'Review deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getUserRating = async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId, type: 'buyer' })
    if (reviews.length === 0) {
      return res.json({ rating: 0, count: 0 })
    }
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    res.json({ rating: avg, count: reviews.length })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
