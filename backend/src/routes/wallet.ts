import express from 'express'
import * as walletController from '../controllers/walletController'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

router.get('/', authMiddleware, walletController.getWallet)
router.get('/transactions', authMiddleware, walletController.getTransactions)
router.post('/withdraw', authMiddleware, walletController.withdraw)
router.get('/withdrawals', authMiddleware, walletController.getWithdrawRequests)

export default router
