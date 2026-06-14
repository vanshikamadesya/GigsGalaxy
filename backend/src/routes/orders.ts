import express from 'express'
import * as orderController from '../controllers/orderController'
import { authMiddleware } from '../middleware/auth'
import { upload } from '../middleware/upload'

const router = express.Router()

router.post('/', authMiddleware, orderController.createOrder)
router.get('/my', authMiddleware, orderController.getMyOrders)
router.get('/:id', authMiddleware, orderController.getOrderById)
router.patch('/:id/accept', authMiddleware, orderController.acceptOrder)
router.patch('/:id/reject', authMiddleware, orderController.rejectOrder)
router.patch(
  '/:id/deliver',
  authMiddleware,
  upload.array('files', 10),
  orderController.deliverOrder
)
router.patch('/:id/complete', authMiddleware, orderController.completeOrder)
router.patch('/:id/cancel', authMiddleware, orderController.cancelOrder)
router.patch('/:id/revision', authMiddleware, orderController.requestRevision)
router.patch('/:id/status', authMiddleware, orderController.updateOrderStatus)

export default router
