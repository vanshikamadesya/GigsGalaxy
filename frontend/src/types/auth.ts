import type { User } from './index'

export type RegisterRole = 'freelancer' | 'client'

export interface LoginPayload {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterPayload {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  username: string
  role: RegisterRole
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface ResetPasswordPayload {
  token: string
  password: string
  confirmPassword: string
}

export type LoginForm = LoginPayload
export type RegisterForm = RegisterPayload
export type ResetPasswordForm = Pick<ResetPasswordPayload, 'password' | 'confirmPassword'>
export type ValidationErrors = Record<string, string>
