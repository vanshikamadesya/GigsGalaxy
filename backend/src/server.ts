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
const API_BASE_PATH = process.env.API_BASE_PATH || '/api'

const CORS_ORIGINS = [
  'http://localhost:9000',
  'http://localhost:9001',
  'http://127.0.0.1:9000',
  'http://127.0.0.1:9001'
]

app.use(
  cors({
    origin: CORS_ORIGINS,
    credentials: true
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.use(`${API_BASE_PATH}/auth`, authRoutes)
app.use(`${API_BASE_PATH}/gigs`, gigRoutes)
app.use(`${API_BASE_PATH}/users`, userRoutes)
app.use(`${API_BASE_PATH}/orders`, orderRoutes)
app.use(`${API_BASE_PATH}/reviews`, reviewRoutes)
app.use(`${API_BASE_PATH}/chat`, chatRoutes)
app.use(`${API_BASE_PATH}/categories`, categoryRoutes)
app.use(`${API_BASE_PATH}/wallet`, walletRoutes)
app.use(`${API_BASE_PATH}/notifications`, notificationRoutes)
app.use(`${API_BASE_PATH}/dashboard`, dashboardRoutes)
app.use(`${API_BASE_PATH}/admin`, adminRoutes)

app.get(`${API_BASE_PATH}/health`, (_req: Request, res: Response) => {
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
