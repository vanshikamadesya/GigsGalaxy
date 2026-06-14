import express from 'express'
import * as userController from '../controllers/userController'
import { authMiddleware } from '../middleware/auth'
import { upload, parseJsonFields } from '../middleware/upload'

const router = express.Router()

router.get('/freelancers/featured', userController.getFeaturedFreelancers)
router.get('/freelancers/top-rated', userController.getTopRatedFreelancers)
router.get('/freelancers', userController.getFreelancers)
router.get('/bookmarked', authMiddleware, userController.getBookmarkedFreelancers)
router.get('/me/profile', authMiddleware, userController.getMyProfile)
router.put(
  '/me/profile',
  authMiddleware,
  upload.single('avatar'),
  parseJsonFields(['skills', 'languages', 'socialLinks']),
  userController.updateProfile
)
router.put('/me/settings', authMiddleware, userController.updateSettings)
router.post(
  '/me/portfolio',
  authMiddleware,
  upload.array('images', 10),
  parseJsonFields(['technologies', 'skills']),
  userController.addPortfolioItem
)
router.put(
  '/me/portfolio/:id',
  authMiddleware,
  upload.array('images', 10),
  parseJsonFields(['technologies', 'skills']),
  userController.updatePortfolioItem
)
router.delete('/me/portfolio/:id', authMiddleware, userController.deletePortfolioItem)
router.post('/:userId/bookmark', authMiddleware, userController.bookmarkFreelancer)
router.get('/:userId/portfolio', userController.getPortfolio)
router.get('/:username/profile', userController.getProfile)

export default router
