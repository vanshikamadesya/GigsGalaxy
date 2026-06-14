import express from 'express'
import * as dashboardController from '../controllers/dashboardController'
import { authMiddleware, roleMiddleware } from '../middleware/auth'

const router = express.Router()

router.get('/freelancer/stats', authMiddleware, dashboardController.getFreelancerStats)
router.get('/freelancer/earnings', authMiddleware, dashboardController.getFreelancerEarningsChart)
router.get('/client/stats', authMiddleware, dashboardController.getClientStats)
router.get(
  '/admin/stats',
  authMiddleware,
  roleMiddleware(['admin']),
  dashboardController.getAdminStats
)
router.get(
  '/admin/revenue',
  authMiddleware,
  roleMiddleware(['admin']),
  dashboardController.getAdminRevenueChart
)
router.get('/activity', authMiddleware, dashboardController.getActivityLogs)

export default router
