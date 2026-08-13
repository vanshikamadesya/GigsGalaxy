<template>
  <div class="auth-form-wrap animate-fade-in">
    <template v-if="!sent">
      <div class="q-mb-lg">
        <q-icon name="lock_reset" size="48px" color="primary" class="q-mb-md" />
        <h2 class="auth-title">Forgot your password?</h2>
        <p class="auth-subtitle">Enter your email and we'll send you a reset link.</p>
      </div>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <div>
          <label class="field-label">Email Address</label>
          <q-input v-model="email" type="email" dense outlined placeholder="you@example.com" :error="!!error" :error-message="error">
            <template #prepend><q-icon name="email" color="grey-5" size="18px" /></template>
          </q-input>
        </div>

        <q-btn unelevated no-caps type="submit" label="Send Reset Link" class="btn-primary full-width q-py-sm" :loading="loading" />
      </q-form>
    </template>

    <template v-else>
      <div class="text-center animate-fade-in">
        <q-icon name="mark_email_read" size="64px" color="positive" class="q-mb-md" />
        <h2 class="auth-title q-mb-sm">Check your email</h2>
        <p class="text-grey-6 q-mb-lg">
          We sent a password reset link to <strong>{{ email }}</strong>.
          Check your inbox and click the link.
        </p>
        <q-btn flat no-caps label="Resend email" @click="sent = false" />
      </div>
    </template>

    <div class="text-center q-mt-lg">
      <router-link to="/auth/login" class="auth-link">
        <q-icon name="arrow_back" size="16px" /> Back to Sign In
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useAuthStore } from 'src/stores/auth.store'

  const authStore = useAuthStore()
  const email = ref('')
  const error = ref('')
  const loading = ref(false)
  const sent = ref(false)

  async function onSubmit() {
    if (!email.value) { error.value = 'Email is required'; return }
    loading.value = true
    try {
      await authStore.forgotPassword(email.value)
      sent.value = true
    } catch {
      error.value = 'Failed to send reset link. Please try again.'
    } finally {
      loading.value = false
    }
  }
</script>

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;
  .auth-title { font-size: $font-size-2xl; font-weight: 700; margin: 0; }
  .auth-subtitle { color: $text-muted; margin: 4px 0 0; }
  .field-label { font-size: $font-size-sm; font-weight: 500; color: $text-secondary; display: block; margin-bottom: 4px; }
  .auth-link { color: $primary; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
</style>
