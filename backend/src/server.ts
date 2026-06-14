import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import http from 'http'
import path from 'path'
import { connectDB } from './config/database'
import { errorHandler } from './middleware/errorHandler'
import { initSocket } from './socket'

import authRoutes from './routes/auth'
import gigRoutes from './routes/gigs'
import userRoutes from './routes/users'
import orderRoutes from './routes/orders'
import reviewRoutes from './routes/reviews'
import chatRoutes from './routes/chat'
import categoryRoutes from './routes/categories'
import walletRoutes from './routes/wallet'
import notificationRoutes from './routes/notifications'
import dashboardRoutes from './routes/dashboard'
import adminRoutes from './routes/admin'

const app = express()
const httpServer = http.createServer(app)
const PORT = process.env.PORT || 3000

app.use(
  cors({
    origin: ['http://localhost:9000'],
    credentials: true
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/gigs', gigRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.use(errorHandler)

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' })
})

const startServer = async () => {
  try {
    await connectDB()
    initSocket(httpServer)
    httpServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
      console.log(`WebSocket ready on ws://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
