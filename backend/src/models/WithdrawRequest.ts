import mongoose, { Document, Schema } from 'mongoose'

export interface IWithdrawRequest extends Document {
  user: mongoose.Types.ObjectId
  amount: number
  method: 'bank_transfer' | 'paypal' | 'crypto'
  details: Record<string, string>
  status: 'pending' | 'processing' | 'completed' | 'failed'
  processedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const withdrawSchema = new Schema<IWithdrawRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['bank_transfer', 'paypal', 'crypto'], default: 'bank_transfer' },
    details: { type: Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    processedAt: Date
  },
  { timestamps: true }
)

export default mongoose.model<IWithdrawRequest>('WithdrawRequest', withdrawSchema)
