import mongoose, { Document, Schema } from 'mongoose'

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[]
  orderId?: mongoose.Types.ObjectId
  lastMessage?: string
  lastMessageAt?: Date
  createdAt: Date
  updatedAt: Date
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    lastMessage: String,
    lastMessageAt: Date
  },
  { timestamps: true }
)

conversationSchema.index({ participants: 1 })

export default mongoose.model<IConversation>('Conversation', conversationSchema)
