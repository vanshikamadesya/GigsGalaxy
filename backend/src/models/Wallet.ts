import mongoose, { Document, Schema } from 'mongoose'

export interface IWallet extends Document {
  user: mongoose.Types.ObjectId
  balance: number
  pendingBalance: number
  currency: string
  totalEarnings: number
  totalSpent: number
  totalWithdrawn: number
  transactions: Array<{
    type: string
    amount: number
    description: string
    reference?: string
    orderId?: mongoose.Types.ObjectId
    balanceAfter?: number
    status?: string
    date: Date
  }>
  createdAt: Date
  updatedAt: Date
}

const walletSchema = new Schema<IWallet>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    totalEarnings: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 },
    transactions: [
      {
        type: { type: String, required: true },
        amount: { type: Number, required: true },
        description: String,
        reference: String,
        orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
        balanceAfter: Number,
        status: { type: String, default: 'completed' },
        date: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
)

walletSchema.index({ user: 1 })

export default mongoose.model<IWallet>('Wallet', walletSchema)
