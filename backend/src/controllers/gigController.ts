import { Response } from 'express'
import Gig from '../models/Gig'
import User from '../models/User'
import { AuthRequest } from '../middleware/auth'
import { paginated } from '../utils/pagination'
import { formatGig } from '../utils/serializers'

function buildGigQuery(query: any) {
  const q: any = {}
  const { category, query: search, priceMin, priceMax, rating, sortBy } = query

  if (category) q.category = category
  if (priceMin || priceMax) {
    q.basePrice = {}
    if (priceMin) q.basePrice.$gte = Number(priceMin)
    if (priceMax) q.basePrice.$lte = Number(priceMax)
  }
  if (rating) q.rating = { $gte: Number(rating) }
  if (search) {
    q.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ]
  }

  let sort: Record<string, 1 | -1> = { createdAt: -1 }
  if (sortBy === 'price_asc') sort = { basePrice: 1 }
  if (sortBy === 'price_desc') sort = { basePrice: -1 }
  if (sortBy === 'rating') sort = { rating: -1 }
  if (sortBy === 'newest') sort = { createdAt: -1 }

  return { q, sort }
}

export const getGigs = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 12
    const skip = (page - 1) * limit
    const { q, sort } = buildGigQuery(req.query)
    q.status = 'active'
    q.approved = true

    const gigs = await Gig.find(q)
      .populate('seller')
      .skip(skip)
      .limit(limit)
      .sort(sort)
    const total = await Gig.countDocuments(q)

    res.json(paginated(gigs.map(g => formatGig(g)), total, page, limit))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const searchGigs = async (req: AuthRequest, res: Response) => {
  req.query.query = req.query.q
  return getGigs(req, res)
}

export const getGigById = async (req: AuthRequest, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('seller')
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' })
    }
    res.json(formatGig(gig))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getRelatedGigs = async (req: AuthRequest, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id)
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' })
    }
    const related = await Gig.find({
      _id: { $ne: gig._id },
      category: gig.category,
      status: 'active',
      approved: true
    })
      .populate('seller')
      .limit(6)
    res.json(related.map(g => formatGig(g)))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const createGig = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, packages, tags, status } = req.body
    const basicPkg = packages?.find((p: any) => p.name === 'basic') || packages?.[0]

    const gig = new Gig({
      title,
      description,
      category,
      basePrice: basicPkg?.price || 0,
      deliveryDays: basicPkg?.deliveryTime || 7,
      revisions: basicPkg?.revisions || 1,
      features: basicPkg?.features || [],
      packages,
      tags: tags || [],
      images: req.body.images || [],
      seller: req.user?.id,
      status: status === 'draft' ? 'draft' : 'active',
      approved: status === 'draft'
    })

    await gig.save()
    await gig.populate('seller')
    res.status(201).json(formatGig(gig))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateGig = async (req: AuthRequest, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id)
    if (!gig) return res.status(404).json({ message: 'Gig not found' })
    if (gig.seller.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const { title, description, category, packages, tags, status } = req.body
    if (title) gig.title = title
    if (description) gig.description = description
    if (category) gig.category = category
    if (tags) gig.tags = tags
    if (packages) {
      gig.packages = packages
      const basic = packages.find((p: any) => p.name === 'basic') || packages[0]
      if (basic) {
        gig.basePrice = basic.price
        gig.deliveryDays = basic.deliveryTime
        gig.revisions = basic.revisions
        gig.features = basic.features
      }
    }
    if (req.body.images?.length) gig.images = req.body.images
    if (status === 'draft') {
      gig.status = 'draft'
    } else if (status === 'pending_review') {
      gig.status = 'active'
      gig.approved = false
    }

    await gig.save()
    await gig.populate('seller')
    res.json(formatGig(gig))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteGig = async (req: AuthRequest, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id)
    if (!gig) return res.status(404).json({ message: 'Gig not found' })
    if (gig.seller.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' })
    }
    await Gig.deleteOne({ _id: req.params.id })
    res.json({ message: 'Gig deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const publishGig = async (req: AuthRequest, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id)
    if (!gig) return res.status(404).json({ message: 'Gig not found' })
    if (gig.seller.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    gig.status = 'active'
    gig.approved = false
    await gig.save()
    await gig.populate('seller')
    res.json(formatGig(gig))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const draftGig = async (req: AuthRequest, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id)
    if (!gig) return res.status(404).json({ message: 'Gig not found' })
    if (gig.seller.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    gig.status = 'draft'
    await gig.save()
    await gig.populate('seller')
    res.json(formatGig(gig))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getFeaturedGigs = async (_req: AuthRequest, res: Response) => {
  try {
    const gigs = await Gig.find({ status: 'active', approved: true })
      .populate('seller')
      .sort({ isFeatured: -1, rating: -1, orderCount: -1 })
      .limit(6)
    res.json(gigs.map(g => formatGig(g)))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyGigs = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 12
    const skip = (page - 1) * limit

    const gigs = await Gig.find({ seller: req.user?.id })
      .populate('seller')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
    const total = await Gig.countDocuments({ seller: req.user?.id })

    res.json(paginated(gigs.map(g => formatGig(g)), total, page, limit))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const toggleBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    const gigId = req.params.id || req.params.gigId
    const idx = user.bookmarkedGigs?.findIndex(g => g.toString() === gigId) ?? -1
    if (idx >= 0) {
      user.bookmarkedGigs?.splice(idx, 1)
    } else {
      user.bookmarkedGigs = user.bookmarkedGigs || []
      user.bookmarkedGigs.push(gigId as any)
    }
    await user.save()
    res.json({ bookmarked: idx < 0 })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getBookmarkedGigs = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    const gigs = await Gig.find({ _id: { $in: user.bookmarkedGigs || [] } }).populate('seller')
    res.json(gigs.map(g => formatGig(g)))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getPendingGigs = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const skip = (page - 1) * limit
    const gigs = await Gig.find({ status: 'active', approved: false })
      .populate('seller')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
    const total = await Gig.countDocuments({ status: 'active', approved: false })
    res.json(paginated(gigs.map(g => formatGig(g)), total, page, limit))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const approveGig = async (req: AuthRequest, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id)
    if (!gig) return res.status(404).json({ message: 'Gig not found' })
    gig.approved = true
    gig.status = 'active'
    await gig.save()
    await gig.populate('seller')
    res.json(formatGig(gig))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const rejectGig = async (req: AuthRequest, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id)
    if (!gig) return res.status(404).json({ message: 'Gig not found' })
    gig.approved = false
    gig.status = 'inactive'
    await gig.save()
    await gig.populate('seller')
    res.json(formatGig(gig))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
