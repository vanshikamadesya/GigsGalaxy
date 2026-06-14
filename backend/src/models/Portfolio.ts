import mongoose, { Document, Schema } from 'mongoose'

export interface IPortfolioItem extends Document {
  user: mongoose.Types.ObjectId
  title: string
  projectTitle?: string
  description: string
  image?: string
  images?: string[]
  link?: string
  projectUrl?: string
  skills?: string[]
  technologies?: string[]
  category?: string
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const portfolioSchema = new Schema<IPortfolioItem>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    projectTitle: String,
    description: String,
    image: String,
    images: [String],
    link: String,
    projectUrl: String,
    skills: [String],
    technologies: [String],
    category: String,
    completedAt: Date
  },
  { timestamps: true }
)

portfolioSchema.index({ user: 1 })

export default mongoose.model<IPortfolioItem>('PortfolioItem', portfolioSchema)
