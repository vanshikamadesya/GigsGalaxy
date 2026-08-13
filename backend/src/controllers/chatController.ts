import { Response } from 'express'
import Chat from '../models/Chat'
import Conversation from '../models/Conversation'
import User from '../models/User'
import { AuthRequest } from '../middleware/auth'
import { paginated } from '../utils/pagination'
import { formatConversation, formatMessage } from '../utils/serializers'
import { getChatNamespace } from '../socket'

function conversationIdFor(userA: string, userB: string) {
  return [userA, userB].sort().join('_')
}

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id
    const convs = await Conversation.find({ participants: userId }).sort({ updatedAt: -1 })

    const result = await Promise.all(
      convs.map(async conv => {
        const participants = await User.find({ _id: { $in: conv.participants } })
        const lastMsg = await Chat.findOne({ conversationId: conv._id.toString() })
          .sort({ createdAt: -1 })
          .populate('sender')
        const unreadCount = await Chat.countDocuments({
          conversationId: conv._id.toString(),
          recipient: userId,
          isRead: false
        })
        return formatConversation(
          { ...conv.toObject(), unreadCount, orderId: conv.orderId },
          participants,
          lastMsg
        )
      })
    )

    res.json(result)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getOrCreateConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { participantId, orderId } = req.body
    const userId = req.user?.id

    let conv = await Conversation.findOne({
      participants: { $all: [userId, participantId] }
    })

    if (!conv) {
      conv = await Conversation.create({
        participants: [userId, participantId],
        orderId
      })
    }

    const participants = await User.find({ _id: { $in: conv.participants } })
    res.json(formatConversation(conv, participants))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const conversationId = req.params.conversationId
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 50
    const skip = (page - 1) * limit

    const messages = await Chat.find({ conversationId })
      .populate('sender')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
    const total = await Chat.countDocuments({ conversationId })

    await Chat.updateMany(
      { conversationId, recipient: req.user?.id, isRead: false },
      { isRead: true }
    )

    res.json(
      paginated(
        messages.reverse().map(m => formatMessage(m)),
        total,
        page,
        limit
      )
    )
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const conversationId = req.params.conversationId
    const content = req.body.content || req.body.message || ''

    let conv = await Conversation.findById(conversationId)
    if (!conv) {
      conv = await Conversation.findOne({ _id: conversationId })
    }
    if (!conv) {
      return res.status(404).json({ message: 'Conversation not found' })
    }

    const recipient = conv.participants.find(p => p.toString() !== req.user?.id)
    if (!recipient) {
      return res.status(400).json({ message: 'Invalid conversation' })
    }

    const chat = new Chat({
      conversationId: conv._id.toString(),
      sender: req.user?.id,
      recipient,
      message: content,
      content,
      type: req.body.type || 'text',
      fileUrl: req.body.fileUrl,
      fileName: req.body.fileName,
      fileSize: req.body.fileSize
    })

    if (req.file) {
      chat.fileUrl = `/uploads/${req.file.filename}`
      chat.fileName = req.file.originalname
      chat.fileSize = req.file.size
      chat.type = 'file'
    }

    await chat.save()
    await chat.populate('sender')

    conv.lastMessage = content
    conv.lastMessageAt = new Date()
    await conv.save()

    const formatted = formatMessage(chat)
    getChatNamespace()
      ?.to(`user:${recipient.toString()}`)
      .emit('new_message', formatted)

    res.status(201).json(formatted)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Chat.updateMany(
      {
        conversationId: req.params.conversationId,
        recipient: req.user?.id,
        isRead: false
      },
      { isRead: true }
    )
    res.json({ message: 'Marked as read' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    const msg = await Chat.findById(req.params.messageId)
    if (!msg) return res.status(404).json({ message: 'Message not found' })
    if (msg.sender.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    await Chat.deleteOne({ _id: req.params.messageId })
    res.json({ message: 'Message deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// Legacy route support
export const getConversation = getMessages
export const legacySendMessage = async (req: AuthRequest, res: Response) => {
  req.params.conversationId = req.body.conversationId || conversationIdFor(req.user!.id, req.body.recipientId)
  return sendMessage(req, res)
}
