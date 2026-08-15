<template>
  <div class="auth-form-wrap text-center animate-fade-in">
    <template v-if="verifying">
      <q-spinner-orbit color="primary" size="64px" class="q-mb-lg" />
      <h2 class="auth-title">Verifying your email...</h2>
    </template>

    <template v-else-if="success">
      <q-icon name="verified" size="72px" color="positive" class="q-mb-md" />
      <h2 class="auth-title q-mb-sm">Email Verified!</h2>
      <p class="text-grey-6 q-mb-xl">Your email has been verified. You can now access all features.</p>
      <q-btn unelevated no-caps label="Go to Dashboard" class="btn-primary q-px-xl q-py-sm" :to="dashboardPath" />
    </template>

    <template v-else>
      <q-icon name="error_outline" size="72px" color="negative" class="q-mb-md" />
      <h2 class="auth-title q-mb-sm">Verification Failed</h2>
      <p class="text-grey-6 q-mb-xl">The verification link is invalid or has expired.</p>
      <q-btn unelevated no-caps label="Request New Link" class="btn-primary q-px-xl q-py-sm" @click="resend" />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAuthStore } from 'src/stores/auth.store'
  import { authService } from 'src/services/auth.service'

  const route = useRoute()
  const authStore = useAuthStore()

  const verifying = ref(true)
  const success = ref(false)

  const dashboardPath = computed(() => {
    if (authStore.isAdmin) return '/admin/dashboard'
    if (authStore.isFreelancer) return '/freelancer/dashboard'
    return '/client/dashboard'
  })

  onMounted(async () => {
    const token = route.query.token as string
    if (!token) { verifying.value = false; return }
    try {
      await authService.verifyEmail(token)
      success.value = true
      if (authStore.user) authStore.updateUser({ isEmailVerified: true })
    } catch { success.value = false }
    finally { verifying.value = false }
  })

  async function resend() {
    if (authStore.user?.email) {
      await authService.resendVerification(authStore.user.email)
    }
  }
</script>