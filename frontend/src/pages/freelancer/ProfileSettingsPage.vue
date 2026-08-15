<template>
  <q-page class="q-pa-lg">
    <h1 class="text-h5 text-weight-bold q-mb-xl">Profile & Settings</h1>

    <div class="row q-col-gutter-xl">
      <div class="col-12 col-md-8">
        <q-tabs v-model="tab" class="q-mb-xl" active-color="primary" indicator-color="primary" align="left" dense>
          <q-tab name="profile" label="Profile" />
          <q-tab name="skills" label="Skills & Experience" />
          <q-tab name="social" label="Social Links" />
          <q-tab name="account" label="Account" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <!-- Profile Tab -->
          <q-tab-panel name="profile" class="q-pa-none">
            <q-card class="gg-card q-pa-xl">
              <div class="form-section-title q-mb-lg">Basic Information</div>

              <!-- Avatar upload -->
              <div class="avatar-upload-section q-mb-xl">
                <q-avatar size="96px" color="primary" text-color="white" class="cursor-pointer" @click="avatarInput?.click()">
                  <img v-if="avatarPreview || authStore.user?.avatar" :src="avatarPreview || authStore.user?.avatar" />
                  <span v-else class="text-h4">{{ getInitials(authStore.user?.fullName || '') }}</span>
                </q-avatar>
                <input ref="avatarInput" type="file" accept="image/*" style="display:none" @change="handleAvatar" />
                <div class="q-ml-lg">
                  <div class="text-weight-bold">Profile Photo</div>
                  <div class="text-grey-6 text-sm q-mb-sm">JPG or PNG, max 2MB</div>
                  <q-btn flat no-caps size="sm" label="Change Photo" color="primary" @click="avatarInput?.click()" />
                </div>
              </div>

              <div class="q-gutter-md">
                <div class="row q-gutter-md">
                  <div class="col">
                    <label class="field-label">Full Name</label>
                    <q-input v-model="form.fullName" outlined dense />
                  </div>
                  <div class="col">
                    <label class="field-label">Username</label>
                    <q-input v-model="form.username" outlined dense>
                      <template #prepend><span class="text-grey-5">@</span></template>
                    </q-input>
                  </div>
                </div>
                <div>
                  <label class="field-label">Professional Tagline</label>
                  <q-input v-model="form.tagline" outlined dense placeholder="e.g. Full-Stack Developer | Vue.js Expert" counter maxlength="100" />
                </div>
                <div>
                  <label class="field-label">Bio</label>
                  <q-input v-model="form.bio" outlined type="textarea" :rows="5" placeholder="Tell clients about yourself..." counter maxlength="600" />
                </div>
                <div class="row q-gutter-md">
                  <div class="col">
                    <label class="field-label">Country</label>
                    <q-select v-model="form.country" :options="COUNTRIES" outlined dense use-input />
                  </div>
                  <div class="col">
                    <label class="field-label">Hourly Rate ($)</label>
                    <q-input v-model.number="form.hourlyRate" type="number" outlined dense prefix="$" />
                  </div>
                </div>
              </div>
            </q-card>
          </q-tab-panel>

          <!-- Skills Tab -->
          <q-tab-panel name="skills" class="q-pa-none">
            <q-card class="gg-card q-pa-xl">
              <div class="form-section-title q-mb-lg">Skills & Expertise</div>
              <div class="q-gutter-md">
                <div>
                  <label class="field-label">Skills</label>
                  <q-select v-model="form.skills" :options="SKILLS_LIST" outlined dense multiple use-chips use-input placeholder="Add your skills" />
                </div>
                <div>
                  <label class="field-label">Languages</label>
                  <div v-for="(lang, i) in form.languages" :key="i" class="row q-gutter-sm q-mb-sm">
                    <q-select v-model="lang.language" :options="LANGUAGES" outlined dense class="col" placeholder="Language" />
                    <q-select v-model="lang.proficiency" :options="proficiencyOptions" outlined dense emit-value map-options class="col" />
                    <q-btn flat round dense icon="remove" color="negative" @click="form.languages.splice(i, 1)" />
                  </div>
                  <q-btn flat no-caps icon="add" label="Add Language" size="sm" color="primary" @click="form.languages.push({ language: '', proficiency: 'conversational' })" />
                </div>
              </div>
            </q-card>
          </q-tab-panel>

          <!-- Social Tab -->
          <q-tab-panel name="social" class="q-pa-none">
            <q-card class="gg-card q-pa-xl">
              <div class="form-section-title q-mb-lg">Social & Web Links</div>
              <div class="q-gutter-md">
                <q-input v-for="s in socialFields" :key="s.key" v-model="(form.social as Record<string, string>)[s.key]" outlined dense :label="s.label" :placeholder="s.placeholder">
                  <template #prepend><q-icon :name="s.icon" /></template>
                </q-input>
              </div>
            </q-card>
          </q-tab-panel>

          <!-- Account Tab -->
          <q-tab-panel name="account" class="q-pa-none">
            <q-card class="gg-card q-pa-xl q-mb-lg">
              <div class="form-section-title q-mb-lg">Account Settings</div>
              <div class="q-gutter-md">
                <div>
                  <label class="field-label">Email Address</label>
                  <q-input :model-value="authStore.user?.email" outlined dense readonly />
                </div>
                <div>
                  <label class="field-label">Change Password</label>
                  <q-input v-model="passwordForm.current" type="password" outlined dense placeholder="Current password" />
                  <q-input v-model="passwordForm.new" type="password" outlined dense placeholder="New password" class="q-mt-sm" />
                  <q-input v-model="passwordForm.confirm" type="password" outlined dense placeholder="Confirm new password" class="q-mt-sm" />
                </div>
              </div>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>

        <div class="row justify-end q-mt-lg">
          <q-btn unelevated no-caps class="btn-primary q-px-xl" label="Save Changes" :loading="saving" @click="saveProfile" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useAuthStore } from 'src/stores/auth.store'
  import { userService } from 'src/services/user.service'
  import { useNotify } from 'src/composables/useNotify'
  import { getInitials } from 'src/utils/helpers'
  import { COUNTRIES, LANGUAGES, SKILLS_LIST } from 'src/utils/constants'

  const authStore = useAuthStore()
  const notify = useNotify()

  const tab = ref('profile')
  const saving = ref(false)
  const avatarInput = ref<HTMLInputElement | null>(null)
  const avatarPreview = ref('')
  const avatarFile = ref<File | null>(null)

  const form = reactive({
    fullName: authStore.user?.fullName || '',
    username: authStore.user?.username || '',
    tagline: '',
    bio: '',
    country: authStore.user?.country || '',
    hourlyRate: 50,
    skills: [] as string[],
    languages: [{ language: 'English', proficiency: 'native' as const }],
    social: { website: '', linkedin: '', github: '', twitter: '' }
  })

  const passwordForm = reactive({ current: '', new: '', confirm: '' })

  const proficiencyOptions = [
    { label: 'Basic', value: 'basic' },
    { label: 'Conversational', value: 'conversational' },
    { label: 'Fluent', value: 'fluent' },
    { label: 'Native', value: 'native' }
  ]

  const socialFields = [
    { key: 'website', label: 'Personal Website', placeholder: 'https://yoursite.com', icon: 'language' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...', icon: 'fab fa-linkedin' },
    { key: 'github', label: 'GitHub', placeholder: 'https://github.com/...', icon: 'fab fa-github' },
    { key: 'twitter', label: 'Twitter', placeholder: 'https://twitter.com/...', icon: 'fab fa-twitter' }
  ]

  function handleAvatar(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      avatarFile.value = file
      avatarPreview.value = URL.createObjectURL(file)
    }
  }

  async function saveProfile() {
    saving.value = true
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (typeof v === 'object' && !Array.isArray(v)) fd.append(k, JSON.stringify(v))
        else if (Array.isArray(v)) fd.append(k, JSON.stringify(v))
        else fd.append(k, String(v))
      })
      if (avatarFile.value) fd.append('avatar', avatarFile.value)
      await userService.updateProfile(fd)
      notify.success('Profile updated!')
    } catch { notify.error('Failed to save profile') }
    finally { saving.value = false }
  }

  onMounted(async () => {
    try {
      const profile = await userService.getMyProfile()
      form.tagline = profile.tagline || ''
      form.bio = profile.bio || ''
      form.hourlyRate = profile.hourlyRate
      form.skills = profile.skills || []
      form.languages = profile.languages?.length ? profile.languages : form.languages
    } catch { /* use defaults */ }
  })
</script>