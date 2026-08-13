import crypto from 'crypto'
import { Response } from 'express'
import User from '../models/User'
import Wallet from '../models/Wallet'
import { generateTokens, verifyRefreshToken } from '../utils/jwt'
import { AuthRequest } from '../middleware/auth'
import { authResponse, formatUser } from '../utils/serializers'

export const register = async (req: any, res: Response) => {
  try {
    const { email, password, fullName, username, role, firstName, lastName } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const userExists = await User.findOne({ $or: [{ email }, ...(username ? [{ username }] : [])] })
    if (userExists) {
      return res.status(409).json({ message: 'User already exists' })
    }

    let fName = firstName
    let lName = lastName
    if (fullName && !firstName) {
      const parts = fullName.trim().split(/\s+/)
      fName = parts[0]
      lName = parts.slice(1).join(' ') || parts[0]
    }

    const user = new User({
      email,
      password,
      firstName: fName || 'User',
      lastName: lName || '',
      fullName: fullName || `${fName || 'User'} ${lName || ''}`.trim(),
      username: username || email.split('@')[0],
      role: role || 'client',
      emailVerified: false
    })
    await user.save()
    await Wallet.create({ user: user._id })

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.email, user.role)
    res.status(201).json(authResponse(user, accessToken, refreshToken))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req: any, res: Response) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }

    const user = await User.findOne({ email })
    if (!user || user.isBlocked || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.email, user.role)
    res.json(authResponse(user, accessToken, refreshToken))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const logout = async (_req: AuthRequest, res: Response) => {
  res.json({ message: 'Logged out successfully' })
}

export const refreshAccessToken = async (req: any, res: Response) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' })
    }

    const decoded = verifyRefreshToken(refreshToken)
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    const tokens = generateTokens(user._id.toString(), user.email, user.role)
    res.json({ accessToken: tokens.accessToken })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(formatUser(user))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const forgotPassword = async (req: any, res: Response) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (user) {
      user.resetPasswordToken = crypto.createHash('sha256').update(crypto.randomBytes(32)).digest('hex')
      await user.save()
    }
    res.json({ message: 'If that email exists, a reset link has been sent' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const resetPassword = async (req: any, res: Response) => {
  try {
    const { token, password } = req.body
    const user = await User.findOne({ resetPasswordToken: token })
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' })
    }
    user.password = password
    user.resetPasswordToken = undefined
    await user.save()
    res.json({ message: 'Password reset successfully' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const verifyEmail = async (req: any, res: Response) => {
  try {
    const { token } = req.body
    const user = await User.findOne({ verificationToken: token })
    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token' })
    }
    user.emailVerified = true
    user.verified = true
    user.verificationToken = undefined
    await user.save()
    res.json({ message: 'Email verified successfully' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const resendVerification = async (req: any, res: Response) => {
  res.json({ message: 'Verification email sent' })
}

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const valid = await user.comparePassword(oldPassword)
    if (!valid) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }
    user.password = newPassword
    await user.save()
    res.json({ message: 'Password changed successfully' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
