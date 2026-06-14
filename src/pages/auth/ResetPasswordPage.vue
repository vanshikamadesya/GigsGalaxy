<template>
  <div class="auth-form-wrap animate-fade-in">
    <div class="q-mb-lg">
      <q-icon name="lock_reset" size="48px" color="primary" class="q-mb-md" />
      <h2 class="auth-title">Set new password</h2>
      <p class="auth-subtitle">Your new password must be different from previous ones.</p>
    </div>

    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <div>
        <label class="field-label">New Password</label>
        <q-input v-model="form.password" :type="showPwd ? 'text' : 'password'" dense outlined placeholder="Min. 8 characters" :error="!!errors.password" :error-message="errors.password">
          <template #prepend><q-icon name="lock" color="grey-5" size="18px" /></template>
          <template #append>
            <q-icon :name="showPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" size="16px" @click="showPwd = !showPwd" />
          </template>
        </q-input>
      </div>
      <div>
        <label class="field-label">Confirm New Password</label>
        <q-input v-model="form.confirmPassword" :type="showPwd ? 'text' : 'password'" dense outlined placeholder="Repeat new password" :error="!!errors.confirmPassword" :error-message="errors.confirmPassword">
          <template #prepend><q-icon name="lock_outline" color="grey-5" size="18px" /></template>
        </q-input>
      </div>
      <q-btn unelevated no-caps type="submit" label="Reset Password" class="btn-primary full-width q-py-sm" :loading="loading" />
    </q-form>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from 'src/stores/auth.store'
  import { useNotify } from 'src/composables/useNotify'
  import { resetPasswordSchema } from 'src/utils/validators'

  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const notify = useNotify()

  const showPwd = ref(false)
  const loading = ref(false)
  const errors = reactive<Record<string, string>>({})
  const form = reactive({ password: '', confirmPassword: '' })

  async function onSubmit() {
    try {
      await resetPasswordSchema.validate(form, { abortEarly: false })
      Object.keys(errors).forEach(k => delete errors[k])
    } catch (err: unknown) {
      const yupErr = err as { inner?: Array<{ path: string; message: string }> }
      yupErr.inner?.forEach(e => { if (e.path) errors[e.path] = e.message })
      return
    }

    loading.value = true
    try {
      await authStore.resetPassword({ token: route.query.token as string, ...form })
      notify.success('Password reset successfully!')
      router.push('/auth/login')
    } catch {
      notify.error('Reset link is invalid or expired.')
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
</style>
