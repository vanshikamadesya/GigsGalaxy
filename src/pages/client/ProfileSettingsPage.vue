<template>
  <q-page class="q-pa-lg">
    <h1 class="text-h5 text-weight-bold q-mb-xl">Profile & Settings</h1>
    <div class="row q-col-gutter-xl">
      <div class="col-12 col-md-8">
        <q-card class="gg-card q-pa-xl">
          <div class="form-section-title q-mb-xl">Account Information</div>
          <div class="avatar-section row items-center q-gutter-lg q-mb-xl">
            <q-avatar size="80px" color="accent" text-color="white" class="cursor-pointer" @click="avatarInput?.click()">
              <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
              <span v-else class="text-h5">{{ getInitials(authStore.user?.fullName || '') }}</span>
            </q-avatar>
            <input ref="avatarInput" type="file" accept="image/*" style="display:none" @change="handleAvatar" />
            <q-btn flat no-caps size="sm" label="Change Photo" color="primary" @click="avatarInput?.click()" />
          </div>
          <div class="q-gutter-md">
            <div class="row q-gutter-md">
              <div class="col">
                <label class="field-label">Full Name</label>
                <q-input v-model="form.fullName" outlined dense />
              </div>
              <div class="col">
                <label class="field-label">Username</label>
                <q-input v-model="form.username" outlined dense />
              </div>
            </div>
            <div>
              <label class="field-label">Email</label>
              <q-input :model-value="authStore.user?.email" outlined dense readonly />
            </div>
            <div>
              <label class="field-label">Country</label>
              <q-select v-model="form.country" :options="COUNTRIES" outlined dense use-input />
            </div>
          </div>
          <div class="row justify-end q-mt-xl">
            <q-btn unelevated no-caps class="btn-primary q-px-xl" label="Save Changes" :loading="saving" @click="save" />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useAuthStore } from 'src/stores/auth.store'
  import { userService } from 'src/services/user.service'
  import { useNotify } from 'src/composables/useNotify'
  import { getInitials } from 'src/utils/helpers'
  import { COUNTRIES } from 'src/utils/constants'

  const authStore = useAuthStore()
  const notify = useNotify()
  const saving = ref(false)
  const avatarInput = ref<HTMLInputElement | null>(null)
  const form = reactive({ fullName: authStore.user?.fullName || '', username: authStore.user?.username || '', country: authStore.user?.country || '' })

  function handleAvatar(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) { /* handle upload */ }
  }

  async function save() {
    saving.value = true
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      await userService.updateProfile(fd)
      authStore.updateUser(form)
      notify.success('Settings saved!')
    } catch { notify.error('Failed to save') }
    finally { saving.value = false }
  }
</script>

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;
  .form-section-title { font-size: $font-size-xl; font-weight: 700; }
  .field-label { font-size: $font-size-sm; font-weight: 500; color: $text-secondary; display: block; margin-bottom: 4px; }
</style>
