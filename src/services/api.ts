import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from 'src/utils/constants'
import { isTokenExpired } from 'src/utils/helpers'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

let refreshPromise: Promise<string> | null = null

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// Request interceptor – attach JWT
apiClient.interceptors.request.use(
  async config => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      if (isTokenExpired(token)) {
        // Try refresh only once
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null
          })
        }
        try {
          const newToken = await refreshPromise
          config.headers['Authorization'] = `Bearer ${newToken}`
        } catch {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(REFRESH_TOKEN_KEY)
          window.location.href = '/auth/login'
        }
      } else {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor – normalize errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async error => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const newToken = await refreshAccessToken()
        if (originalRequest.headers) {
          (originalRequest.headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`
        }
        return apiClient(originalRequest)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  if (!refreshToken) throw new Error('No refresh token')
  const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
  localStorage.setItem(TOKEN_KEY, data.accessToken)
  return data.accessToken
}

export default apiClient
