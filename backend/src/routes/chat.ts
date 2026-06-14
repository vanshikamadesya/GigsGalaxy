import express from 'express'
import * as chatController from '../controllers/chatController'
import { authMiddleware } from '../middleware/auth'
import { upload } from '../middleware/upload'

const router = express.Router()

router.get('/conversations', authMiddleware, chatController.getConversations)
router.post('/conversations', authMiddleware, chatController.getOrCreateConversation)
router.get(
  '/conversations/:conversationId/messages',
  authMiddleware,
  chatController.getMessages
)
router.post(
  '/conversations/:conversationId/messages',
  authMiddleware,
  upload.single('file'),
  chatController.sendMessage
)
router.patch('/conversations/:conversationId/read', authMiddleware, chatController.markAsRead)
router.delete('/messages/:messageId', authMiddleware, chatController.deleteMessage)

export default router
