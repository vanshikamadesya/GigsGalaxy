import express from 'express'
import * as notificationController from '../controllers/notificationController'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

router.get('/unread-count', authMiddleware, notificationController.getUnreadCount)
router.patch('/read-all', authMiddleware, notificationController.markAllAsRead)
router.get('/', authMiddleware, notificationController.getNotifications)
router.patch('/:id/read', authMiddleware, notificationController.markAsRead)
router.delete('/:id', authMiddleware, notificationController.deleteNotification)

export default router
