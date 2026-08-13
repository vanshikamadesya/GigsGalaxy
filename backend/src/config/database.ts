import mongoose from 'mongoose'
import dns from 'dns'

// Force Google DNS to fix SRV record resolution issues with local IPv6 routers
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gig-galaxy'
    await mongoose.connect(uri)
    console.log('MongoDB connected:', uri)
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect()
    console.log('MongoDB disconnected')
  } catch (error) {
    console.error('MongoDB disconnection error:', error)
  }
}
