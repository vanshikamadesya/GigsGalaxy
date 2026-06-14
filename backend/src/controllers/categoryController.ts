import { Response } from 'express'
import Category from '../models/Category'
import Gig from '../models/Gig'
import { AuthRequest } from '../middleware/auth'
import { formatCategory } from '../utils/serializers'

export const getCategories = async (_req: AuthRequest, res: Response) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 })
    const result = await Promise.all(
      categories.map(async cat => {
        const gigCount = await Gig.countDocuments({
          category: cat.slug,
          status: 'active',
          approved: true
        })
        return formatCategory(cat, gigCount)
      })
    )
    res.json(result)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getCategoryBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
    if (!category) return res.status(404).json({ message: 'Category not found' })
    const gigCount = await Gig.countDocuments({
      category: category.slug,
      status: 'active',
      approved: true
    })
    res.json(formatCategory(category, gigCount))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, icon, description } = req.body
    const category = await Category.create({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      icon,
      description
    })
    res.status(201).json(formatCategory(category))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json(formatCategory(category))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    await Category.deleteOne({ _id: req.params.id })
    res.json({ message: 'Category deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
