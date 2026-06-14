import { Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import User from './models/User'

let io: Server | null = null
const onlineUsers = new Map<string, string>()

export function getIO() {
  return io
}

export function initSocket(httpServer: HttpServer) {
  // BUG: server uses namespace '/chat' but client connects to '/messages' — they never meet
  io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:9000', 'http://localhost:9001'],
      credentials: true
    }
  })

  const chatNs = io.of('/chat')

  chatNs.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token
      if (!token) return next(new Error('Authentication required'))
      const jwtSecret = process.env.JWT_SECRET || 'secret'
      const decoded = jwt.verify(token, jwtSecret) as { id: string }
      const user = await User.findById(decoded.id)
      if (!user) return next(new Error('User not found'))
      socket.data.userId = decoded.id
      next()
    } catch {
      next(new Error('Invalid token'))
    }
  })

  chatNs.on('connection', (socket: Socket) => {
    const userId = socket.data.userId as string
    onlineUsers.set(userId, socket.id)
    socket.join(`user:${userId}`)
    chatNs.emit('user_online', { userId })

    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.broadcast.emit('typing', { userId, conversationId, isTyping })
    })

    socket.on('disconnect', () => {
      onlineUsers.delete(userId)
      chatNs.emit('user_offline', { userId })
    })
  })

  return io
}
