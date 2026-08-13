import { Server as HttpServer } from 'http'
import { Server, Socket, Namespace } from 'socket.io'
import jwt from 'jsonwebtoken'
import User from './models/User'

let io: Server | null = null
let chatNs: Namespace | null = null
const onlineUsers = new Map<string, string>()

const SOCKET_CORS_ORIGINS = [
  'http://localhost:9000',
  'http://localhost:9001',
  'http://127.0.0.1:9000',
  'http://127.0.0.1:9001'
]

export function getIO() {
  return io
}

export function getChatNamespace() {
  return chatNs
}

export function initSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: SOCKET_CORS_ORIGINS,
      credentials: true
    }
  })

  chatNs = io.of('/chat')

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
    chatNs!.emit('user_online', { userId })

    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.broadcast.emit('typing', { userId, conversationId, isTyping })
    })

    socket.on('disconnect', () => {
      onlineUsers.delete(userId)
      chatNs!.emit('user_offline', { userId })
    })
  })

  return io
}
