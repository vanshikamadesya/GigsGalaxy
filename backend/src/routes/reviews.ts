import express from 'express'
import * as reviewController from '../controllers/reviewController'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

router.get('/my', authMiddleware, reviewController.getMyReviews)
router.get('/freelancer/:freelancerId', reviewController.getFreelancerReviews)
router.get('/gig/:gigId', reviewController.getGigReviews)
router.get('/user/:userId', reviewController.getUserRating)
router.post('/', authMiddleware, reviewController.createReview)
router.post('/:reviewId/reply', authMiddleware, reviewController.replyToReview)
router.delete('/:id', authMiddleware, reviewController.deleteReview)

export default router
