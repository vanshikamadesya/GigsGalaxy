import mongoose, { Document, Schema } from 'mongoose'

export interface IGigPackage {
  name: 'basic' | 'standard' | 'premium'
  title: string
  description: string
  price: number
  deliveryTime: number
  revisions: number
  features: string[]
}

export interface IGig extends Document {
  title: string
  description: string
  category: string
  subcategory?: string
  seller: mongoose.Types.ObjectId
  basePrice: number
  currency: string
  deliveryDays: number
  revisions: number
  features?: string[]
  packages?: IGigPackage[]
  image?: string
  images?: string[]
  tags?: string[]
  status: 'draft' | 'active' | 'inactive' | 'completed'
  approved: boolean
  isFeatured: boolean
  rating?: number
  totalReviews?: number
  orderCount: number
  createdAt: Date
  updatedAt: Date
}

const gigSchema = new Schema<IGig>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: String,
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    basePrice: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    deliveryDays: { type: Number, required: true },
    revisions: { type: Number, default: 0 },
    features: [String],
    packages: [
      {
        name: { type: String, enum: ['basic', 'standard', 'premium'] },
        title: String,
        description: String,
        price: Number,
        deliveryTime: Number,
        revisions: Number,
        features: [String]
      }
    ],
    image: String,
    images: [String],
    tags: [String],
    status: { type: String, enum: ['draft', 'active', 'inactive', 'completed'], default: 'draft' },
    approved: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 }
  },
  { timestamps: true }
)

gigSchema.index({ category: 1, status: 1 })
gigSchema.index({ seller: 1, status: 1 })

export default mongoose.model<IGig>('Gig', gigSchema)
