import jwt from 'jsonwebtoken'

export const generateTokens = (userId: string, email: string, role: string) => {
  const jwtSecret = process.env.JWT_SECRET || 'secret'
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret'

  const accessToken = jwt.sign({ id: userId, email, role }, jwtSecret as any, { expiresIn: '7d' })

  const refreshToken = jwt.sign({ id: userId }, refreshSecret as any, { expiresIn: '30d' })

  return { accessToken, refreshToken }
}

export const verifyRefreshToken = (token: string) => {
  try {
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret'
    return jwt.verify(token, refreshSecret as any) as any
  } catch {
    return null
  }
}
