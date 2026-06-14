import mongoose, { Document, Schema } from 'mongoose'

export interface IReview extends Document {
  order: mongoose.Types.ObjectId
  gig?: mongoose.Types.ObjectId
  reviewer: mongoose.Types.ObjectId
  reviewee: mongoose.Types.ObjectId
  rating: number
  comment: string
  type: 'buyer' | 'seller'
  reply?: string
  repliedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new Schema<IReview>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    gig: { type: Schema.Types.ObjectId, ref: 'Gig' },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    type: { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
    reply: String,
    repliedAt: Date
  },
  { timestamps: true }
)

reviewSchema.index({ reviewee: 1, type: 1 })
reviewSchema.index({ reviewer: 1 })
reviewSchema.index({ gig: 1 })

export default mongoose.model<IReview>('Review', reviewSchema)
