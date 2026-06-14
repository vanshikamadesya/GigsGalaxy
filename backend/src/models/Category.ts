import mongoose, { Document, Schema } from 'mongoose'

export interface ICategory extends Document {
  name: string
  slug: string
  description?: string
  icon?: string
  image?: string
  parentId?: mongoose.Types.ObjectId
  featured: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    icon: String,
    image: String,
    parentId: { type: Schema.Types.ObjectId, ref: 'Category' },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

categorySchema.index({ slug: 1 })
categorySchema.index({ featured: 1 })

export default mongoose.model<ICategory>('Category', categorySchema)
