import mongoose from 'mongoose'

function idOf(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (value instanceof mongoose.Types.ObjectId) return value.toString()
  if (typeof value === 'object' && value !== null && '_id' in value) {
    return idOf((value as { _id: unknown })._id)
  }
  return String(value)
}

export function formatUser(user: any) {
  if (!user) return null
  const doc = user.toObject ? user.toObject() : user
  const firstName = doc.firstName || ''
  const lastName = doc.lastName || ''
  return {
    id: idOf(doc._id || doc.id),
    email: doc.email,
    username: doc.username || doc.email?.split('@')[0] || '',
    fullName: doc.fullName || `${firstName} ${lastName}`.trim(),
    avatar: doc.avatar,
    role: doc.role,
    isVerified: doc.verified ?? false,
    isEmailVerified: doc.emailVerified ?? doc.verified ?? false,
    isBlocked: doc.isBlocked ?? !doc.isActive,
    country: doc.location || doc.country,
    timezone: doc.timezone,
    language: doc.language || 'en',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  }
}

export function formatFreelancerProfile(user: any, extras: Record<string, unknown> = {}) {
  const base = formatUser(user)
  if (!base) return null
  const doc = user.toObject ? user.toObject() : user
  return {
    id: base.id,
    userId: base.id,
    user: base,
    bio: doc.bio || '',
    tagline: doc.tagline || '',
    skills: doc.skills || [],
    languages: doc.languages || [],
    education: doc.education || [],
    certifications: doc.certifications || [],
    hourlyRate: doc.hourlyRate || 0,
    availability: doc.availability || 'full_time',
    completedProjects: doc.completedProjects || 0,
    averageRating: doc.averageRating || doc.rating || 0,
    totalReviews: doc.totalReviews || 0,
    responseTime: doc.responseTime || '< 24 hours',
    memberSince: doc.createdAt,
    portfolio: extras.portfolio || [],
    socialLinks: doc.socialLinks || {},
    level: doc.level || 'new'
  }
}

function gigStatus(doc: any): string {
  if (doc.status === 'draft') return 'draft'
  if (doc.status === 'inactive' && !doc.approved) return 'rejected'
  if (doc.status === 'active' && !doc.approved) return 'pending_review'
  if (doc.status === 'active' && doc.approved) return 'published'
  return doc.status || 'draft'
}

function defaultPackages(doc: any) {
  const base = doc.basePrice || 0
  const days = doc.deliveryDays || 7
  const rev = doc.revisions ?? 1
  const features = doc.features || []
  if (doc.packages?.length) return doc.packages
  return [
    {
      name: 'basic',
      title: 'Basic',
      description: doc.description || '',
      price: base,
      deliveryTime: days,
      revisions: rev,
      features
    },
    {
      name: 'standard',
      title: 'Standard',
      description: doc.description || '',
      price: Math.round(base * 1.5),
      deliveryTime: Math.max(1, days - 2),
      revisions: rev + 1,
      features: [...features, 'Priority support']
    },
    {
      name: 'premium',
      title: 'Premium',
      description: doc.description || '',
      price: base * 2,
      deliveryTime: Math.max(1, days - 4),
      revisions: rev + 2,
      features: [...features, 'Priority support', 'Source files']
    }
  ]
}

export function formatGig(gig: any, sellerProfile?: any) {
  if (!gig) return null
  const doc = gig.toObject ? gig.toObject() : gig
  const seller = doc.seller
  const freelancer =
    sellerProfile ||
    (seller && typeof seller === 'object' ? formatFreelancerProfile(seller) : undefined)

  return {
    id: idOf(doc._id || doc.id),
    freelancerId: idOf(doc.seller),
    freelancer,
    title: doc.title,
    category: doc.category,
    subcategory: doc.subcategory,
    description: doc.description,
    tags: doc.tags || [],
    images: doc.images?.length ? doc.images : doc.image ? [doc.image] : [],
    packages: defaultPackages(doc),
    status: gigStatus(doc),
    averageRating: doc.rating || 0,
    totalReviews: doc.totalReviews || 0,
    totalOrders: doc.orderCount || 0,
    isActive: doc.status === 'active' && doc.approved,
    isFeatured: doc.isFeatured ?? false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  }
}

export function formatOrder(order: any) {
  if (!order) return null
  const doc = order.toObject ? order.toObject() : order
  const gig = doc.gig && typeof doc.gig === 'object' ? formatGig(doc.gig) : undefined
  const buyer = doc.buyer && typeof doc.buyer === 'object' ? formatUser(doc.buyer) : undefined
  const seller =
    doc.seller && typeof doc.seller === 'object'
      ? formatFreelancerProfile(doc.seller)
      : undefined

  const pkg = gig?.packages?.find(
    (p: any) => p.name === (doc.packageType || 'basic')
  )

  return {
    id: idOf(doc._id || doc.id),
    gigId: idOf(doc.gig),
    gig,
    clientId: idOf(doc.buyer),
    client: buyer,
    freelancerId: idOf(doc.seller),
    freelancer: seller,
    packageType: doc.packageType || 'basic',
    status: doc.status,
    price: doc.totalAmount || doc.amount || pkg?.price || 0,
    deliveryTime: pkg?.deliveryTime || doc.deliveryDays || 7,
    revisions: pkg?.revisions ?? doc.revisions ?? 1,
    requirements: doc.requirements || [],
    deliverables: (doc.deliverables || []).map((d: any) => ({
      id: idOf(d._id || d.id),
      fileName: d.fileName,
      fileUrl: d.fileUrl,
      fileSize: d.fileSize || 0,
      uploadedAt: d.uploadedAt || d.createdAt,
      description: d.description
    })),
    dueDate: doc.deliveryDate || doc.dueDate,
    completedAt: doc.completedAt,
    cancelledAt: doc.cancelledAt,
    cancelReason: doc.cancelReason,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  }
}

export function formatReview(review: any) {
  if (!review) return null
  const doc = review.toObject ? review.toObject() : review
  const reviewer =
    doc.reviewer && typeof doc.reviewer === 'object' ? formatUser(doc.reviewer) : undefined

  return {
    id: idOf(doc._id || doc.id),
    orderId: idOf(doc.order),
    gigId: idOf(doc.gig),
    gig: doc.gig && typeof doc.gig === 'object' ? formatGig(doc.gig) : undefined,
    clientId: idOf(doc.reviewer),
    client: reviewer,
    freelancerId: idOf(doc.reviewee),
    rating: doc.rating,
    comment: doc.comment || '',
    createdAt: doc.createdAt,
    reply: doc.reply,
    repliedAt: doc.repliedAt
  }
}

export function formatPortfolioItem(item: any) {
  if (!item) return null
  const doc = item.toObject ? item.toObject() : item
  return {
    id: idOf(doc._id || doc.id),
    freelancerId: idOf(doc.user),
    projectTitle: doc.projectTitle || doc.title,
    description: doc.description || '',
    projectUrl: doc.projectUrl || doc.link,
    technologies: doc.technologies || doc.skills || [],
    images: doc.images?.length ? doc.images : doc.image ? [doc.image] : [],
    category: doc.category || '',
    completedAt: doc.completedAt || doc.createdAt,
    createdAt: doc.createdAt
  }
}

export function formatCategory(category: any, gigCount = 0) {
  if (!category) return null
  const doc = category.toObject ? category.toObject() : category
  return {
    id: idOf(doc._id || doc.id),
    name: doc.name,
    slug: doc.slug,
    icon: doc.icon || 'category',
    description: doc.description,
    parentId: doc.parentId ? idOf(doc.parentId) : undefined,
    gigCount,
    isActive: doc.isActive ?? true
  }
}

export function formatMessage(msg: any) {
  if (!msg) return null
  const doc = msg.toObject ? msg.toObject() : msg
  const sender =
    doc.sender && typeof doc.sender === 'object' ? formatUser(doc.sender) : undefined
  return {
    id: idOf(doc._id || doc.id),
    conversationId: doc.conversationId,
    senderId: idOf(doc.sender),
    sender,
    content: doc.content || doc.message || '',
    type: doc.type || 'text',
    fileUrl: doc.fileUrl,
    fileName: doc.fileName,
    fileSize: doc.fileSize,
    isRead: doc.isRead ?? false,
    createdAt: doc.createdAt
  }
}

export function formatConversation(conv: any, participants: any[], lastMessage?: any) {
  return {
    id: idOf(conv._id || conv.id || conv.conversationId),
    participants: participants.map(p => formatUser(p)).filter(Boolean),
    lastMessage: lastMessage ? formatMessage(lastMessage) : undefined,
    unreadCount: conv.unreadCount || 0,
    createdAt: conv.createdAt,
    updatedAt: conv.updatedAt || conv.lastMessageTime,
    orderId: conv.orderId ? idOf(conv.orderId) : undefined
  }
}

export function formatNotification(n: any) {
  if (!n) return null
  const doc = n.toObject ? n.toObject() : n
  return {
    id: idOf(doc._id || doc.id),
    userId: idOf(doc.user),
    type: doc.type,
    title: doc.title,
    message: doc.message,
    isRead: doc.isRead ?? false,
    actionUrl: doc.actionUrl,
    metadata: doc.data || doc.metadata,
    createdAt: doc.createdAt
  }
}

export function formatWallet(wallet: any, transactions: any[] = []) {
  if (!wallet) return null
  const doc = wallet.toObject ? wallet.toObject() : wallet
  return {
    userId: idOf(doc.user),
    availableBalance: doc.balance ?? doc.availableBalance ?? 0,
    pendingBalance: doc.pendingBalance ?? 0,
    totalEarnings: doc.totalEarnings ?? 0,
    totalWithdrawn: doc.totalWithdrawn ?? 0,
    currency: doc.currency || 'USD',
    transactions: transactions.map(t => ({
      id: idOf(t._id || t.id),
      userId: idOf(doc.user),
      type: t.type,
      amount: t.amount,
      balance: t.balanceAfter ?? t.balance ?? 0,
      description: t.description || '',
      orderId: t.orderId ? idOf(t.orderId) : undefined,
      status: t.status || 'completed',
      createdAt: t.date || t.createdAt
    }))
  }
}

export function authResponse(user: any, accessToken: string, refreshToken: string) {
  return {
    user: formatUser(user),
    accessToken,
    refreshToken,
    expiresIn: 604800
  }
}
