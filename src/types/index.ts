// ============================================================
// Core Domain Types for Gig Galaxy
// ============================================================

export type UserRole = 'admin' | 'freelancer' | 'client'
export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'delivered'
  | 'completed'
  | 'cancelled'
export type GigStatus = 'draft' | 'published' | 'rejected' | 'pending_review'
export type WithdrawStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type NotificationType =
  | 'new_order'
  | 'order_accepted'
  | 'project_delivered'
  | 'payment_released'
  | 'new_message'
  | 'review_received'
  | 'gig_approved'
  | 'gig_rejected'

// ============================================================
// User Types
// ============================================================

export interface User {
  id: string
  email: string
  username: string
  fullName: string
  avatar?: string
  role: UserRole
  isVerified: boolean
  isEmailVerified: boolean
  isBlocked: boolean
  country?: string
  timezone?: string
  language?: string
  createdAt: string
  updatedAt: string
}

export interface FreelancerProfile {
  id: string
  userId: string
  user: User
  bio: string
  tagline: string
  skills: string[]
  languages: LanguageEntry[]
  education: EducationEntry[]
  certifications: CertificationEntry[]
  hourlyRate: number
  availability: 'full_time' | 'part_time' | 'not_available'
  completedProjects: number
  averageRating: number
  totalReviews: number
  responseTime: string
  memberSince: string
  portfolio: PortfolioItem[]
  socialLinks: SocialLinks
  level: 'new' | 'level_1' | 'level_2' | 'top_rated'
}

export interface LanguageEntry {
  language: string
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native'
}

export interface EducationEntry {
  institution: string
  degree: string
  fieldOfStudy: string
  from: string
  to?: string
  current: boolean
}

export interface CertificationEntry {
  name: string
  provider: string
  year: string
  url?: string
}

export interface SocialLinks {
  website?: string
  linkedin?: string
  github?: string
  twitter?: string
  behance?: string
  dribbble?: string
}

// ============================================================
// Gig Types
// ============================================================

export interface GigPackage {
  name: 'basic' | 'standard' | 'premium'
  title: string
  description: string
  price: number
  deliveryTime: number
  revisions: number
  features: string[]
}

export interface Gig {
  id: string
  freelancerId: string
  freelancer: FreelancerProfile
  title: string
  category: string
  subcategory?: string
  description: string
  tags: string[]
  images: string[]
  packages: GigPackage[]
  status: GigStatus
  averageRating: number
  totalReviews: number
  totalOrders: number
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

// ============================================================
// Category Types
// ============================================================

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description?: string
  parentId?: string
  children?: Category[]
  gigCount?: number
  isActive: boolean
}

// ============================================================
// Order Types
// ============================================================

export interface OrderRequirement {
  question: string
  answer: string
}

export interface OrderDeliverable {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  uploadedAt: string
  description?: string
}

export interface Order {
  id: string
  gigId: string
  gig: Gig
  clientId: string
  client: User
  freelancerId: string
  freelancer: FreelancerProfile
  packageType: 'basic' | 'standard' | 'premium'
  status: OrderStatus
  price: number
  deliveryTime: number
  revisions: number
  requirements: OrderRequirement[]
  deliverables: OrderDeliverable[]
  dueDate: string
  completedAt?: string
  cancelledAt?: string
  cancelReason?: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// Review Types
// ============================================================

export interface Review {
  id: string
  orderId: string
  gigId: string
  gig?: Gig
  clientId: string
  client: User
  freelancerId: string
  rating: number
  comment: string
  createdAt: string
  reply?: string
  repliedAt?: string
}

export interface RatingBreakdown {
  communication: number
  serviceQuality: number
  valueForMoney: number
  recommend: number
}

// ============================================================
// Portfolio Types
// ============================================================

export interface PortfolioItem {
  id: string
  freelancerId: string
  projectTitle: string
  description: string
  projectUrl?: string
  technologies: string[]
  images: string[]
  category: string
  completedAt: string
  createdAt: string
}

// ============================================================
// Chat / Message Types
// ============================================================

export interface Conversation {
  id: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
  orderId?: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  sender: User
  content: string
  type: 'text' | 'image' | 'file' | 'emoji'
  fileUrl?: string
  fileName?: string
  fileSize?: number
  isRead: boolean
  createdAt: string
}

// ============================================================
// Wallet Types
// ============================================================

export interface WalletTransaction {
  id: string
  userId: string
  type: 'credit' | 'debit' | 'escrow_hold' | 'escrow_release' | 'withdrawal'
  amount: number
  balance: number
  description: string
  orderId?: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
}

export interface Wallet {
  userId: string
  availableBalance: number
  pendingBalance: number
  totalEarnings: number
  totalWithdrawn: number
  currency: string
  transactions: WalletTransaction[]
}

export interface WithdrawRequest {
  id: string
  userId: string
  amount: number
  method: 'bank_transfer' | 'paypal' | 'crypto'
  details: Record<string, string>
  status: WithdrawStatus
  createdAt: string
  processedAt?: string
}

// ============================================================
// Notification Types
// ============================================================

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

// ============================================================
// Search / Filter Types
// ============================================================

export interface SearchFilters {
  query?: string
  category?: string
  priceMin?: number
  priceMax?: number
  rating?: number
  experience?: string
  country?: string
  deliveryTime?: number
  sortBy?: 'relevance' | 'rating' | 'price_asc' | 'price_desc' | 'newest'
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ============================================================
// Auth Types
// ============================================================

export interface LoginPayload {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterPayload {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  username: string
  role: 'freelancer' | 'client'
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface ResetPasswordPayload {
  token: string
  password: string
  confirmPassword: string
}

// ============================================================
// Dashboard Analytics Types
// ============================================================

export interface DashboardStats {
  totalGigs?: number
  activeOrders: number
  completedOrders: number
  totalEarnings?: number
  totalSpending?: number
  totalReviews?: number
  averageRating?: number
  responseRate?: number
  onTimeDelivery?: number
}

export interface EarningsChart {
  month: string
  earnings: number
  orders: number
}

export interface AdminStats {
  totalUsers: number
  totalFreelancers: number
  totalClients: number
  totalGigs: number
  totalOrders: number
  totalRevenue: number
  activeOrders: number
  pendingVerifications: number
  pendingGigs: number
}
