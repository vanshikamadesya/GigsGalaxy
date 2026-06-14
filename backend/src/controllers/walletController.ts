import { Response } from 'express'
import Wallet from '../models/Wallet'
import WithdrawRequest from '../models/WithdrawRequest'
import { AuthRequest } from '../middleware/auth'
import { paginated } from '../utils/pagination'
import { formatWallet } from '../utils/serializers'

export const getWallet = async (req: AuthRequest, res: Response) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user?.id })
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user?.id })
    }
    res.json(formatWallet(wallet, wallet.transactions.slice(-20).reverse()))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const wallet = await Wallet.findOne({ user: req.user?.id })
    if (!wallet) {
      return res.json(paginated([], 0, page, limit))
    }
    const txs = [...wallet.transactions].reverse()
    const total = txs.length
    const skip = (page - 1) * limit
    const slice = txs.slice(skip, skip + limit)
    res.json(
      paginated(
        slice.map((t, i) => ({
          id: `${wallet._id}-${skip + i}`,
          userId: wallet.user.toString(),
          type: t.type,
          amount: t.amount,
          balance: t.balanceAfter || wallet.balance,
          description: t.description,
          orderId: t.orderId?.toString(),
          status: t.status || 'completed',
          createdAt: t.date
        })),
        total,
        page,
        limit
      )
    )
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const withdraw = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, method, details } = req.body
    const wallet = await Wallet.findOne({ user: req.user?.id })
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' })
    }

    wallet.balance -= amount
    wallet.pendingBalance = (wallet.pendingBalance || 0) + amount
    wallet.transactions.push({
      type: 'withdrawal',
      amount,
      description: 'Withdrawal request',
      balanceAfter: wallet.balance,
      status: 'pending',
      date: new Date()
    })
    await wallet.save()

    const request = await WithdrawRequest.create({
      user: req.user?.id,
      amount,
      method,
      details,
      status: 'pending'
    })

    res.status(201).json({
      id: request._id.toString(),
      userId: req.user?.id,
      amount,
      method,
      details,
      status: request.status,
      createdAt: request.createdAt
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getWithdrawRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await WithdrawRequest.find({ user: req.user?.id }).sort({ createdAt: -1 })
    res.json(
      requests.map(r => ({
        id: r._id.toString(),
        userId: r.user.toString(),
        amount: r.amount,
        method: r.method,
        details: r.details,
        status: r.status,
        createdAt: r.createdAt,
        processedAt: r.processedAt
      }))
    )
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const processWithdrawal = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body
    const request = await WithdrawRequest.findById(req.params.id)
    if (!request) return res.status(404).json({ message: 'Withdrawal not found' })

    request.status = status
    request.processedAt = new Date()
    await request.save()

    const wallet = await Wallet.findOne({ user: request.user })
    if (wallet) {
      wallet.pendingBalance = Math.max(0, (wallet.pendingBalance || 0) - request.amount)
      if (status === 'completed') {
        wallet.totalWithdrawn = (wallet.totalWithdrawn || 0) + request.amount
      } else if (status === 'failed') {
        wallet.balance += request.amount
      }
      await wallet.save()
    }

    res.json({ message: 'Withdrawal processed', status })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
