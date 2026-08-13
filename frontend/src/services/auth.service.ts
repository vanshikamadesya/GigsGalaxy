import api from './api'
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  ResetPasswordPayload,
  User
} from 'src/types'

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload).then(r => r.data),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', payload).then(r => r.data),

  logout: () => api.post('/auth/logout').then(r => r.data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then(r => r.data),

  resetPassword: (payload: ResetPasswordPayload) =>
    api.post('/auth/reset-password', payload).then(r => r.data),

  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }).then(r => r.data),

  resendVerification: (email: string) =>
    api.post('/auth/resend-verification', { email }).then(r => r.data),

  getMe: () => api.get<User>('/auth/me').then(r => r.data),

  refreshToken: (refreshToken: string) =>
    api.post<{ accessToken: string }>('/auth/refresh', { refreshToken }).then(r => r.data),

  changePassword: (oldPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { oldPassword, newPassword }).then(r => r.data)
}
