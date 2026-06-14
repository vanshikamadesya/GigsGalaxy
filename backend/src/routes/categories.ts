import express from 'express'
import * as categoryController from '../controllers/categoryController'
import { authMiddleware, roleMiddleware } from '../middleware/auth'

const router = express.Router()

router.get('/', categoryController.getCategories)
router.get('/:slug', categoryController.getCategoryBySlug)

export default router
