import { defineBoot } from '#q-app/wrappers'
import { useAuthStore } from 'src/stores/auth.store'

export default defineBoot(async () => {
  const authStore = useAuthStore()

  // If we have a token stored, verify it by fetching the current user
  if (authStore.accessToken) {
    await authStore.fetchMe()
  }
})
