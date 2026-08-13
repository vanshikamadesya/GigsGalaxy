<template>
  <div class="auth-form-wrap animate-fade-in">
    <div class="q-mb-lg">
      <h2 class="auth-title">Welcome back</h2>
      <p class="auth-subtitle">Sign in to your GigGalaxy account</p>
    </div>

    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <!-- Email -->
      <div>
        <label class="field-label">Email Address</label>
        <q-input
          v-model="form.email"
          type="email"
          dense outlined
          placeholder="you@example.com"
          :error="!!errors.email"
          :error-message="errors.email"
        >
          <template #prepend><q-icon name="email" color="grey-5" size="18px" /></template>
        </q-input>
      </div>

      <!-- Password -->
      <div>
        <div class="row items-center justify-between">
          <label class="field-label">Password</label>
          <router-link to="/auth/forgot-password" class="forgot-link">Forgot password?</router-link>
        </div>
        <q-input
          v-model="form.password"
          :type="showPwd ? 'text' : 'password'"
          dense outlined
          placeholder="Your password"
          :error="!!errors.password"
          :error-message="errors.password"
        >
          <template #prepend><q-icon name="lock" color="grey-5" size="18px" /></template>
          <template #append>
            <q-icon :name="showPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" size="18px" @click="showPwd = !showPwd" />
          </template>
        </q-input>
      </div>

      <!-- Remember me -->
      <q-checkbox v-model="form.rememberMe" label="Remember me for 30 days" color="primary" dense />

      <!-- Error banner -->
      <q-banner v-if="authStore.error" rounded dense class="bg-negative text-white">
        <template #avatar><q-icon name="error" /></template>
        {{ authStore.error }}
      </q-banner>

      <!-- Submit -->
      <q-btn
        unelevated no-caps
        type="submit"
        label="Sign In"
        class="btn-primary full-width q-py-sm q-mt-sm"
        :loading="authStore.loading"
      />

      <!-- Social divider -->
      <div class="divider row items-center q-gutter-sm">
        <div class="divider-line" />
        <span class="divider-text">or continue with</span>
        <div class="divider-line" />
      </div>

      <!-- Social buttons -->
      <div class="row q-gutter-sm">
        <q-btn flat outlined no-caps class="col social-btn">
          <img src="https://www.google.com/favicon.ico" width="18" class="q-mr-sm" />
          Google
        </q-btn>
        <q-btn flat outlined no-caps class="col social-btn">
          <q-icon name="fab fa-github" size="18px" class="q-mr-sm" />
          GitHub
        </q-btn>
      </div>
    </q-form>

    <div class="text-center q-mt-lg">
      <span class="text-grey-6">Don't have an account? </span>
      <router-link to="/auth/register" class="auth-link">Create one free</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useAuthStore } from 'src/stores/auth.store'
  import { useNotify } from 'src/composables/useNotify'
  import { loginSchema } from 'src/utils/validators'
  import type { LoginForm, ValidationErrors } from 'src/types/auth'

  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()
  const notify = useNotify()

  const showPwd = ref(false)
  const errors = reactive<ValidationErrors>({})

  const form = reactive<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  })

  async function onSubmit() {
    // Validate
    try {
      await loginSchema.validate(form, { abortEarly: false })
      Object.keys(errors).forEach(k => delete errors[k])
    } catch (err: unknown) {
      const yupErr = err as { inner?: Array<{ path: string; message: string }> }
      yupErr.inner?.forEach(e => { if (e.path) errors[e.path] = e.message })
      return
    }

    try {
      await authStore.login(form)
      notify.success('Welcome back!')
      const redirect = route.query.redirect as string
      if (redirect) {
        router.push(redirect)
      } else {
        const dest = authStore.isAdmin ? '/admin/dashboard' : authStore.isFreelancer ? '/freelancer/dashboard' : '/client/dashboard'
        router.push(dest)
      }
    } catch {
      // authStore.error already set
    }
  }
</script>

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;

  .auth-title { font-size: $font-size-2xl; font-weight: 700; margin: 0; }
  .auth-subtitle { color: $text-muted; margin: 4px 0 0; }
  .field-label { font-size: $font-size-sm; font-weight: 500; color: $text-secondary; display: block; margin-bottom: 4px; }
  .forgot-link { font-size: $font-size-xs; color: $primary; text-decoration: none; &:hover { text-decoration: underline; } }
  .auth-link { color: $primary; font-weight: 600; text-decoration: none; &:hover { text-decoration: underline; } }

  .divider { &-line { flex: 1; height: 1px; background: $border-color; } &-text { font-size: $font-size-xs; color: $text-muted; white-space: nowrap; } }

  .social-btn {
    border-color: $border-color !important;
    font-size: $font-size-sm !important;
    border-radius: $radius-md !important;
  }
</style>
