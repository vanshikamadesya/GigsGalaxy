<template>
  <div class="auth-form-wrap animate-fade-in">
    <div class="q-mb-lg">
      <h2 class="auth-title">Create your account</h2>
      <p class="auth-subtitle">Join thousands of freelancers and clients</p>
    </div>

    <!-- Role selector -->
    <div class="role-selector q-mb-lg">
      <div
        class="role-option"
        :class="{ active: form.role === 'client' }"
        @click="form.role = 'client'"
      >
        <q-icon name="work" size="24px" :color="form.role === 'client' ? 'primary' : 'grey'" />
        <div class="role-label">I want to hire</div>
        <div class="role-desc">Client</div>
      </div>
      <div
        class="role-option"
        :class="{ active: form.role === 'freelancer' }"
        @click="form.role = 'freelancer'"
      >
        <q-icon name="engineering" size="24px" :color="form.role === 'freelancer' ? 'primary' : 'grey'" />
        <div class="role-label">I want to work</div>
        <div class="role-desc">Freelancer</div>
      </div>
    </div>
    <div v-if="errors.role" class="text-negative text-sm q-mb-md">{{ errors.role }}</div>

    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <div class="row q-gutter-sm">
        <div class="col">
          <label class="field-label">Full Name</label>
          <q-input v-model="form.fullName" dense outlined placeholder="John Doe" :error="!!errors.fullName" :error-message="errors.fullName">
            <template #prepend><q-icon name="person" color="grey-5" size="18px" /></template>
          </q-input>
        </div>
        <div class="col">
          <label class="field-label">Username</label>
          <q-input v-model="form.username" dense outlined placeholder="johndoe" :error="!!errors.username" :error-message="errors.username">
            <template #prepend><q-icon name="alternate_email" color="grey-5" size="18px" /></template>
          </q-input>
        </div>
      </div>

      <div>
        <label class="field-label">Email Address</label>
        <q-input v-model="form.email" type="email" dense outlined placeholder="you@example.com" :error="!!errors.email" :error-message="errors.email">
          <template #prepend><q-icon name="email" color="grey-5" size="18px" /></template>
        </q-input>
      </div>

      <div class="row q-gutter-sm">
        <div class="col">
          <label class="field-label">Password</label>
          <q-input v-model="form.password" :type="showPwd ? 'text' : 'password'" dense outlined placeholder="Min. 8 characters" :error="!!errors.password" :error-message="errors.password">
            <template #prepend><q-icon name="lock" color="grey-5" size="18px" /></template>
            <template #append>
              <q-icon :name="showPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" size="16px" @click="showPwd = !showPwd" />
            </template>
          </q-input>
        </div>
        <div class="col">
          <label class="field-label">Confirm Password</label>
          <q-input v-model="form.confirmPassword" :type="showPwd ? 'text' : 'password'" dense outlined placeholder="Repeat password" :error="!!errors.confirmPassword" :error-message="errors.confirmPassword">
            <template #prepend><q-icon name="lock_outline" color="grey-5" size="18px" /></template>
          </q-input>
        </div>
      </div>

      <!-- Password strength -->
      <div v-if="form.password" class="pwd-strength">
        <div class="pwd-bars row q-gutter-xs">
          <div v-for="i in 4" :key="i" class="pwd-bar" :class="i <= pwdStrength ? `strength-${pwdStrength}` : ''" />
        </div>
        <span class="text-xs q-ml-sm" :class="pwdStrengthColor">{{ pwdStrengthLabel }}</span>
      </div>

      <q-banner v-if="authStore.error" rounded dense class="bg-negative text-white">
        <template #avatar><q-icon name="error" /></template>
        {{ authStore.error }}
      </q-banner>

      <div class="text-xs text-grey-6 q-mt-xs">
        By creating an account, you agree to our
        <a href="#" class="text-primary">Terms of Service</a> and
        <a href="#" class="text-primary">Privacy Policy</a>.
      </div>

      <q-btn
        unelevated no-caps
        type="submit"
        :label="`Create ${form.role === 'freelancer' ? 'Freelancer' : 'Client'} Account`"
        class="btn-primary full-width q-py-sm"
        :loading="authStore.loading"
      />
    </q-form>

    <div class="text-center q-mt-lg">
      <span class="text-grey-6">Already have an account? </span>
      <router-link to="/auth/login" class="auth-link">Sign in</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from 'src/stores/auth.store'
  import { useNotify } from 'src/composables/useNotify'
  import { registerSchema } from 'src/utils/validators'

  const router = useRouter()
  const authStore = useAuthStore()
  const notify = useNotify()

  const showPwd = ref(false)
  const errors = reactive<Record<string, string>>({})

  const form = reactive({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client' as 'client' | 'freelancer'
  })

  const pwdStrength = computed(() => {
    const p = form.password
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  })

  const pwdStrengthLabel = computed(() => {
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
    return labels[pwdStrength.value] || ''
  })

  const pwdStrengthColor = computed(() => {
    const colors = ['', 'text-negative', 'text-warning', 'text-info', 'text-positive']
    return colors[pwdStrength.value] || ''
  })

  async function onSubmit() {
    try {
      await registerSchema.validate(form, { abortEarly: false })
      Object.keys(errors).forEach(k => delete errors[k])
    } catch (err: unknown) {
      const yupErr = err as { inner?: Array<{ path: string; message: string }> }
      yupErr.inner?.forEach(e => { if (e.path) errors[e.path] = e.message })
      return
    }

    try {
      await authStore.register(form)
      notify.success('Account created! Please verify your email.')
      const dest = form.role === 'freelancer' ? '/freelancer/dashboard' : '/client/dashboard'
      router.push(dest)
    } catch { /* authStore.error set */ }
  }
</script>

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;

  .auth-title { font-size: $font-size-2xl; font-weight: 700; margin: 0; }
  .auth-subtitle { color: $text-muted; margin: 4px 0 0; }
  .field-label { font-size: $font-size-sm; font-weight: 500; color: $text-secondary; display: block; margin-bottom: 4px; }
  .auth-link { color: $primary; font-weight: 600; text-decoration: none; &:hover { text-decoration: underline; } }

  .role-selector {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-sm;
  }

  .role-option {
    border: 2px solid $border-color;
    border-radius: $radius-md;
    padding: $spacing-md;
    text-align: center;
    cursor: pointer;
    transition: all $transition-fast;

    &.active {
      border-color: $primary;
      background: rgba(91, 33, 182, 0.04);
    }

    .role-label { font-size: $font-size-sm; font-weight: 600; margin-top: 6px; }
    .role-desc  { font-size: $font-size-xs; color: $text-muted; }
  }

  .pwd-strength { display: flex; align-items: center; }
  .pwd-bars { flex: 1; }

  .pwd-bar {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: $border-color;
    transition: background $transition-base;

    &.strength-1 { background: $danger; }
    &.strength-2 { background: $warning; }
    &.strength-3 { background: $info; }
    &.strength-4 { background: $success; }
  }
</style>
