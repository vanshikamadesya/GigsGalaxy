import express from 'express'
import * as authController from '../controllers/authController'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authMiddleware, authController.logout)
router.post('/refresh', authController.refreshAccessToken)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)
router.post('/verify-email', authController.verifyEmail)
router.post('/resend-verification', authController.resendVerification)
router.put('/change-password', authMiddleware, authController.changePassword)
router.get('/me', authMiddleware, authController.getMe)

export default router
