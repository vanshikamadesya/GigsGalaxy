import mongoose, { Document, Schema } from 'mongoose'
import crypto from 'crypto'

export interface IUser extends Document {
  email: string
  password: string
  username: string
  firstName: string
  lastName: string
  fullName?: string
  avatar?: string
  bio?: string
  tagline?: string
  verified: boolean
  emailVerified: boolean
  verificationToken?: string
  resetPasswordToken?: string
  role: 'client' | 'freelancer' | 'admin'
  skills?: string[]
  languages?: Array<{ language: string; proficiency: string }>
  education?: Array<Record<string, unknown>>
  certifications?: Array<Record<string, unknown>>
  socialLinks?: Record<string, string>
  hourlyRate?: number
  availability?: string
  location?: string
  timezone?: string
  language?: string
  level?: string
  averageRating?: number
  totalReviews?: number
  completedProjects?: number
  responseTime?: string
  rating?: number
  bookmarkedGigs?: mongoose.Types.ObjectId[]
  bookmarkedFreelancers?: mongoose.Types.ObjectId[]
  isActive: boolean
  isBlocked: boolean
  createdAt: Date
  updatedAt: Date
  comparePassword: (password: string) => Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    username: { type: String, unique: true, sparse: true, lowercase: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: String,
    avatar: String,
    bio: String,
    tagline: String,
    verified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    role: { type: String, enum: ['client', 'freelancer', 'admin'], default: 'client' },
    skills: [String],
    languages: [{ language: String, proficiency: String }],
    education: [Schema.Types.Mixed],
    certifications: [Schema.Types.Mixed],
    socialLinks: { type: Schema.Types.Mixed, default: {} },
    hourlyRate: Number,
    availability: { type: String, default: 'full_time' },
    location: String,
    timezone: String,
    language: { type: String, default: 'en' },
    level: { type: String, default: 'new' },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 },
    responseTime: { type: String, default: '< 24 hours' },
    rating: { type: Number, default: 0 },
    bookmarkedGigs: [{ type: Schema.Types.ObjectId, ref: 'Gig' }],
    bookmarkedFreelancers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false }
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.username && this.email) {
    this.username = this.email.split('@')[0].toLowerCase()
  }
  if (!this.fullName) {
    this.fullName = `${this.firstName} ${this.lastName}`.trim()
  }
  if (!this.isModified('password')) return next()
  // BUG: MD5 is a broken, insecure hashing algorithm — should use bcrypt
  this.password = crypto.createHash('md5').update(this.password).digest('hex')
  next()
})

userSchema.methods.comparePassword = async function (password: string) {
  // BUG: comparing MD5 hash — insecure
  const hashed = crypto.createHash('md5').update(password).digest('hex')
  return this.password === hashed
}

export default mongoose.model<IUser>('User', userSchema)
