import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from 'src/services/auth.service'
import type {
  User,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload
} from 'src/types'
import { TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from 'src/utils/constants'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  )
  const accessToken = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isFreelancer = computed(() => user.value?.role === 'freelancer')
  const isClient = computed(() => user.value?.role === 'client')
  const userRole = computed(() => user.value?.role)

  function setAuth(userData: User, token: string, refreshToken: string) {
    user.value = userData
    accessToken.value = token
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  function clearAuth() {
    user.value = null
    accessToken.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  async function login(payload: LoginPayload) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(payload)
      setAuth(response.user, response.accessToken, response.refreshToken)
      return response
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      error.value = axiosErr.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(payload: RegisterPayload) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.register(payload)
      setAuth(response.user, response.accessToken, response.refreshToken)
      return response
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      error.value = axiosErr.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      clearAuth()
    }
  }

  async function fetchMe() {
    try {
      const userData = await authService.getMe()
      user.value = userData
      localStorage.setItem(USER_KEY, JSON.stringify(userData))
      return userData
    } catch {
      clearAuth()
    }
  }

  async function forgotPassword(email: string) {
    loading.value = true
    error.value = null
    try {
      return await authService.forgotPassword(email)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      error.value = axiosErr.response?.data?.message || 'Request failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(payload: ResetPasswordPayload) {
    loading.value = true
    error.value = null
    try {
      return await authService.resetPassword(payload)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      error.value = axiosErr.response?.data?.message || 'Reset failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  function updateUser(updates: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      localStorage.setItem(USER_KEY, JSON.stringify(user.value))
    }
  }

  return {
    user,
    accessToken,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isFreelancer,
    isClient,
    userRole,
    login,
    register,
    logout,
    fetchMe,
    forgotPassword,
    resetPassword,
    updateUser,
    clearAuth
  }
})
