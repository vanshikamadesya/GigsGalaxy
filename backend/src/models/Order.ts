import mongoose, { Document, Schema } from 'mongoose'

export interface IOrder extends Document {
  gig: mongoose.Types.ObjectId
  buyer: mongoose.Types.ObjectId
  seller: mongoose.Types.ObjectId
  packageType: 'basic' | 'standard' | 'premium'
  amount: number
  currency: string
  status: 'pending' | 'accepted' | 'in_progress' | 'delivered' | 'completed' | 'cancelled'
  quantity: number
  totalAmount: number
  requirements?: Array<{ question: string; answer: string }>
  deliverables?: Array<{
    fileName: string
    fileUrl: string
    fileSize?: number
    description?: string
    uploadedAt?: Date
  }>
  deliveryDate?: Date
  completedAt?: Date
  cancelledAt?: Date
  cancelReason?: string
  revisionNotes?: string
  message?: string
  createdAt: Date
  updatedAt: Date
}

const orderSchema = new Schema<IOrder>(
  {
    gig: { type: Schema.Types.ObjectId, ref: 'Gig', required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    packageType: { type: String, enum: ['basic', 'standard', 'premium'], default: 'basic' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in_progress', 'delivered', 'completed', 'cancelled'],
      default: 'pending'
    },
    quantity: { type: Number, default: 1 },
    totalAmount: { type: Number, required: true },
    requirements: [{ question: String, answer: String }],
    deliverables: [
      {
        fileName: String,
        fileUrl: String,
        fileSize: Number,
        description: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    deliveryDate: Date,
    completedAt: Date,
    cancelledAt: Date,
    cancelReason: String,
    revisionNotes: String,
    message: String
  },
  { timestamps: true }
)

orderSchema.index({ buyer: 1, status: 1 })
orderSchema.index({ seller: 1, status: 1 })

export default mongoose.model<IOrder>('Order', orderSchema)
