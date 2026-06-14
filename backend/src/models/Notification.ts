import mongoose, { Document, Schema } from 'mongoose'

export interface INotification extends Document {
  user: mongoose.Types.ObjectId
  type: string
  title: string
  message: string
  actionUrl?: string
  data?: Record<string, any>
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    actionUrl: String,
    data: Schema.Types.Mixed,
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
)

notificationSchema.index({ user: 1, isRead: 1 })

export default mongoose.model<INotification>('Notification', notificationSchema)
