import express from 'express'
import * as userController from '../controllers/userController'
import * as gigController from '../controllers/gigController'
import * as orderController from '../controllers/orderController'
import * as categoryController from '../controllers/categoryController'
import * as walletController from '../controllers/walletController'
import { authMiddleware, roleMiddleware } from '../middleware/auth'

const router = express.Router()

router.use(authMiddleware, roleMiddleware(['admin']))

router.get('/users', userController.getAllUsers)
router.patch('/users/:userId/verify', userController.verifyFreelancer)
router.patch('/users/:userId/block', userController.blockUser)
router.patch('/users/:userId/unblock', userController.unblockUser)
router.delete('/users/:userId', userController.deleteUser)

router.get('/gigs/pending', gigController.getPendingGigs)
router.patch('/gigs/:id/approve', gigController.approveGig)
router.patch('/gigs/:id/reject', gigController.rejectGig)

router.get('/orders', orderController.getAllOrders)

router.post('/categories', categoryController.createCategory)
router.put('/categories/:id', categoryController.updateCategory)
router.delete('/categories/:id', categoryController.deleteCategory)

router.patch('/wallet/withdrawals/:id', walletController.processWithdrawal)

export default router
