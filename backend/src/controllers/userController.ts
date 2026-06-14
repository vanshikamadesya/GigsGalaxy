import { Response } from 'express'
import User from '../models/User'
import PortfolioItem from '../models/Portfolio'
import Review from '../models/Review'
import { AuthRequest } from '../middleware/auth'
import { paginated } from '../utils/pagination'
import {
  formatFreelancerProfile,
  formatPortfolioItem,
  formatUser
} from '../utils/serializers'

export const getFreelancers = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 12
    const skip = (page - 1) * limit
    const { skills, query, country } = req.query

    const q: any = { role: 'freelancer', isActive: true, isBlocked: false }
    if (skills) q.skills = { $in: Array.isArray(skills) ? skills : [skills] }
    if (country) q.location = country
    if (query) {
      q.$or = [
        { fullName: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ]
    }

    const freelancers = await User.find(q).skip(skip).limit(limit).sort({ averageRating: -1 })
    const total = await User.countDocuments(q)

    res.json(
      paginated(
        freelancers.map(f => formatFreelancerProfile(f)),
        total,
        page,
        limit
      )
    )
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getFeaturedFreelancers = async (_req: AuthRequest, res: Response) => {
  try {
    const freelancers = await User.find({
      role: 'freelancer',
      isActive: true,
      isBlocked: false
    })
      .sort({ averageRating: -1, completedProjects: -1 })
      .limit(6)
    res.json(freelancers.map(f => formatFreelancerProfile(f)))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getTopRatedFreelancers = async (_req: AuthRequest, res: Response) => {
  try {
    const freelancers = await User.find({
      role: 'freelancer',
      isActive: true,
      isBlocked: false
    })
      .sort({ averageRating: -1 })
      .limit(10)
    res.json(freelancers.map(f => formatFreelancerProfile(f)))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({
      $or: [{ username: req.params.username }, { email: req.params.username }]
    }).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const portfolio = await PortfolioItem.find({ user: user._id })
    const reviews = await Review.find({ reviewee: user._id, type: 'buyer' })
    const avgRating =
      reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

    user.averageRating = avgRating
    user.totalReviews = reviews.length

    res.json(
      formatFreelancerProfile(user, {
        portfolio: portfolio.map(p => formatPortfolioItem(p))
      })
    )
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    const portfolio = await PortfolioItem.find({ user: req.user?.id })
    res.json(
      formatFreelancerProfile(user, {
        portfolio: portfolio.map(p => formatPortfolioItem(p))
      })
    )
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const allowed = [
      'bio',
      'tagline',
      'skills',
      'languages',
      'education',
      'certifications',
      'socialLinks',
      'hourlyRate',
      'availability',
      'location',
      'timezone',
      'fullName',
      'username',
      'avatar'
    ]
    const updates: Record<string, unknown> = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }
    if (updates.fullName && typeof updates.fullName === 'string') {
      const parts = (updates.fullName as string).trim().split(/\s+/)
      updates.firstName = parts[0]
      updates.lastName = parts.slice(1).join(' ')
    }

    const user = await User.findByIdAndUpdate(req.user?.id, updates, { new: true }).select(
      '-password'
    )
    if (!user) return res.status(404).json({ message: 'User not found' })
    const portfolio = await PortfolioItem.find({ user: req.user?.id })
    res.json(
      formatFreelancerProfile(user, {
        portfolio: portfolio.map(p => formatPortfolioItem(p))
      })
    )
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.user?.id, req.body, { new: true }).select(
      '-password'
    )
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(formatUser(user))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const addPortfolioItem = async (req: AuthRequest, res: Response) => {
  try {
    const portfolio = new PortfolioItem({
      user: req.user?.id,
      title: req.body.projectTitle || req.body.title,
      projectTitle: req.body.projectTitle || req.body.title,
      description: req.body.description,
      projectUrl: req.body.projectUrl || req.body.link,
      link: req.body.projectUrl || req.body.link,
      technologies: req.body.technologies || req.body.skills || [],
      skills: req.body.technologies || req.body.skills || [],
      category: req.body.category,
      images: req.body.images || [],
      completedAt: req.body.completedAt || new Date()
    })
    await portfolio.save()
    res.status(201).json(formatPortfolioItem(portfolio))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updatePortfolioItem = async (req: AuthRequest, res: Response) => {
  try {
    const portfolio = await PortfolioItem.findById(req.params.id)
    if (!portfolio) return res.status(404).json({ message: 'Portfolio item not found' })
    if (portfolio.user.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    Object.assign(portfolio, req.body)
    if (req.body.projectTitle) portfolio.title = req.body.projectTitle
    await portfolio.save()
    res.json(formatPortfolioItem(portfolio))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getPortfolio = async (req: AuthRequest, res: Response) => {
  try {
    const portfolio = await PortfolioItem.find({ user: req.params.userId })
    res.json(portfolio.map(p => formatPortfolioItem(p)))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deletePortfolioItem = async (req: AuthRequest, res: Response) => {
  try {
    const portfolio = await PortfolioItem.findById(req.params.id)
    if (!portfolio) return res.status(404).json({ message: 'Portfolio item not found' })
    if (portfolio.user.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    await PortfolioItem.deleteOne({ _id: req.params.id })
    res.json({ message: 'Portfolio item deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const bookmarkFreelancer = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    const targetId = req.params.userId
    const idx = user.bookmarkedFreelancers?.findIndex(f => f.toString() === targetId) ?? -1
    if (idx >= 0) {
      user.bookmarkedFreelancers?.splice(idx, 1)
    } else {
      user.bookmarkedFreelancers = user.bookmarkedFreelancers || []
      user.bookmarkedFreelancers.push(targetId as any)
    }
    await user.save()
    res.json({ bookmarked: idx < 0 })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getBookmarkedFreelancers = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    const freelancers = await User.find({ _id: { $in: user.bookmarkedFreelancers || [] } })
    res.json(freelancers.map(f => formatFreelancerProfile(f)))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const skip = (page - 1) * limit
    const { role, search } = req.query
    const q: any = {}
    if (role) q.role = role
    if (search) {
      q.$or = [
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ]
    }
    const users = await User.find(q).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 })
    const total = await User.countDocuments(q)
    res.json(paginated(users.map(u => formatUser(u)), total, page, limit))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const verifyFreelancer = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { verified: true },
      { new: true }
    ).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(formatUser(user))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const blockUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isBlocked: true, isActive: false },
      { new: true }
    ).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(formatUser(user))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const unblockUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isBlocked: false, isActive: true },
      { new: true }
    ).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(formatUser(user))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    await User.deleteOne({ _id: req.params.userId })
    res.json({ message: 'User deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
