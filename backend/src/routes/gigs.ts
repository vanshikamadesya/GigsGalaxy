import express from 'express'
import * as gigController from '../controllers/gigController'
import { authMiddleware } from '../middleware/auth'
import { upload, parseJsonFields } from '../middleware/upload'

const router = express.Router()

router.get('/featured', gigController.getFeaturedGigs)
router.get('/search', gigController.searchGigs)
router.get('/bookmarked', authMiddleware, gigController.getBookmarkedGigs)
router.get('/my', authMiddleware, gigController.getMyGigs)
router.get('/', gigController.getGigs)
router.post(
  '/',
  authMiddleware,
  upload.array('images', 10),
  parseJsonFields(['tags', 'packages']),
  gigController.createGig
)
router.get('/:id/related', gigController.getRelatedGigs)
router.post('/:id/bookmark', authMiddleware, gigController.toggleBookmark)
router.get('/:id', gigController.getGigById)
router.put(
  '/:id',
  authMiddleware,
  upload.array('images', 10),
  parseJsonFields(['tags', 'packages']),
  gigController.updateGig
)
router.delete('/:id', authMiddleware, gigController.deleteGig)
router.patch('/:id/publish', authMiddleware, gigController.publishGig)
router.patch('/:id/draft', authMiddleware, gigController.draftGig)

export default router
