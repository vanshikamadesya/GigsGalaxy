<template>
  <q-page class="q-pa-lg admin-page">
    <h1 class="text-h5 text-weight-bold q-mb-xl">Platform Settings</h1>
    <div class="row q-col-gutter-xl">
      <div class="col-12 col-md-8">
        <q-card class="gg-card q-pa-xl q-mb-lg">
          <div class="form-section-title q-mb-lg">General Settings</div>
          <div class="q-gutter-md">
            <div><label class="field-label">Platform Name</label><q-input v-model="settings.platformName" outlined dense /></div>
            <div><label class="field-label">Platform Fee (%)</label><q-input v-model.number="settings.platformFee" type="number" outlined dense suffix="%" /></div>
            <div><label class="field-label">Default Currency</label><q-select v-model="settings.currency" :options="['USD','EUR','GBP']" outlined dense /></div>
            <div><label class="field-label">Support Email</label><q-input v-model="settings.supportEmail" type="email" outlined dense /></div>
          </div>
        </q-card>

        <q-card class="gg-card q-pa-xl q-mb-lg">
          <div class="form-section-title q-mb-lg">Moderation Settings</div>
          <div class="q-gutter-md">
            <q-toggle v-model="settings.requireGigApproval" label="Require gig approval before publishing" color="primary" />
            <q-toggle v-model="settings.requireFreelancerVerification" label="Require freelancer verification" color="primary" />
            <q-toggle v-model="settings.autoReleasePayment" label="Auto-release payment after 14 days" color="primary" />
          </div>
        </q-card>

        <q-card class="gg-card q-pa-xl">
          <div class="form-section-title q-mb-lg">Email Notifications</div>
          <div class="q-gutter-md">
            <q-toggle v-model="settings.emailNewOrder" label="New order notifications" color="primary" />
            <q-toggle v-model="settings.emailOrderComplete" label="Order completion notifications" color="primary" />
            <q-toggle v-model="settings.emailNewUser" label="New user registration notifications" color="primary" />
          </div>
        </q-card>

        <div class="row justify-end q-mt-lg">
          <q-btn unelevated no-caps class="btn-primary q-px-xl" label="Save Settings" :loading="saving" @click="save" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { useNotify } from 'src/composables/useNotify'

  const notify = useNotify()
  const saving = ref(false)

  const settings = reactive({
    platformName: 'GigGalaxy',
    platformFee: 20,
    currency: 'USD',
    supportEmail: 'support@giggalaxy.com',
    requireGigApproval: true,
    requireFreelancerVerification: false,
    autoReleasePayment: true,
    emailNewOrder: true,
    emailOrderComplete: true,
    emailNewUser: false
  })

  async function save() {
    saving.value = true
    await new Promise(r => setTimeout(r, 800))
    saving.value = false
    notify.success('Settings saved!')
  }
</script>