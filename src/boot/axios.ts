import { defineBoot } from '#q-app/wrappers'
import { useQuasar } from 'quasar'
import apiClient from 'src/services/api'

export default defineBoot(({ app }) => {
  // Make axios available globally
  app.config.globalProperties.$axios = apiClient

  // Add Quasar notify on global request errors (optional interceptor enhancement)
  apiClient.interceptors.response.use(
    response => response,
    error => {
      // Individual components handle their errors; this is a fallback
      return Promise.reject(error)
    }
  )
})
