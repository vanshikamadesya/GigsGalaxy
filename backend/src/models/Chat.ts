import mongoose, { Document, Schema } from 'mongoose'

export interface IChat extends Document {
  conversationId: string
  sender: mongoose.Types.ObjectId
  recipient: mongoose.Types.ObjectId
  order?: mongoose.Types.ObjectId
  message: string
  content?: string
  type: 'text' | 'image' | 'file' | 'emoji'
  fileUrl?: string
  fileName?: string
  fileSize?: number
  isRead: boolean
  attachments?: string[]
  createdAt: Date
  updatedAt: Date
}

const chatSchema = new Schema<IChat>(
  {
    conversationId: { type: String, required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    message: { type: String, required: true },
    content: String,
    type: { type: String, enum: ['text', 'image', 'file', 'emoji'], default: 'text' },
    fileUrl: String,
    fileName: String,
    fileSize: Number,
    isRead: { type: Boolean, default: false },
    attachments: [String]
  },
  { timestamps: true }
)

chatSchema.index({ conversationId: 1, createdAt: -1 })
chatSchema.index({ sender: 1 })
chatSchema.index({ recipient: 1 })

export default mongoose.model<IChat>('Chat', chatSchema)
