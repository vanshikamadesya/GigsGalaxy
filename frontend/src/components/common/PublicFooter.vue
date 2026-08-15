<template>
  <footer class="site-footer">
    <div class="page-container">
      <!-- Top -->
      <div class="footer-grid q-pb-xl">
        <!-- Brand -->
        <div class="footer-brand">
          <div class="logo row items-center q-gutter-xs q-mb-md">
            <q-icon name="auto_awesome" size="28px" color="secondary" />
            <span class="logo-text">Gig<span class="text-secondary">Galaxy</span></span>
          </div>
          <p class="footer-desc">
            The world's leading marketplace for digital services. Connect with talented freelancers and grow your business.
          </p>
          <div class="social-links row q-gutter-sm q-mt-md">
            <q-btn v-for="s in socials" :key="s.icon" flat round :icon="s.icon" size="sm" color="white" class="social-btn" />
          </div>
        </div>

        <!-- Links -->
        <div v-for="col in linkColumns" :key="col.title" class="footer-col">
          <div class="footer-col-title">{{ col.title }}</div>
          <ul class="footer-links">
            <li v-for="link in col.links" :key="link.label">
              <router-link :to="link.to" class="footer-link">{{ link.label }}</router-link>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div class="footer-col">
          <div class="footer-col-title">Stay in the loop</div>
          <p class="text-white opacity-70 text-sm q-mb-md">Get the latest gigs and talent delivered to your inbox.</p>
          <div class="newsletter-form">
            <q-input
              v-model="email"
              dense
              dark
              outlined
              placeholder="Enter your email"
              class="newsletter-input"
            >
              <template #append>
                <q-btn flat dense icon="send" color="secondary" @click="subscribe" />
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <q-separator dark class="q-mb-lg" />

      <!-- Bottom -->
      <div class="footer-bottom row items-center justify-between q-pb-lg">
        <div class="text-white opacity-60 text-sm">
          © {{ currentYear }} GigGalaxy. All rights reserved.
        </div>
        <div class="row q-gutter-md">
          <a href="#" class="footer-legal-link">Privacy Policy</a>
          <a href="#" class="footer-legal-link">Terms of Service</a>
          <a href="#" class="footer-legal-link">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useQuasar } from 'quasar'

  const $q = useQuasar()
  const email = ref('')
  const currentYear = new Date().getFullYear()

  const socials = [
    { icon: 'fab fa-twitter' },
    { icon: 'fab fa-linkedin' },
    { icon: 'fab fa-facebook' },
    { icon: 'fab fa-instagram' }
  ]

  const linkColumns = [
    {
      title: 'For Clients',
      links: [
        { label: 'Browse Gigs', to: '/gigs' },
        { label: 'Find Freelancers', to: '/freelancers' },
        { label: 'How It Works', to: '/#how-it-works' },
        { label: 'Enterprise', to: '/' }
      ]
    },
    {
      title: 'For Freelancers',
      links: [
        { label: 'Become a Seller', to: '/auth/register' },
        { label: 'Create a Gig', to: '/freelancer/gigs/create' },
        { label: 'Freelancer Academy', to: '/' },
        { label: 'Success Stories', to: '/' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', to: '/' },
        { label: 'Contact Us', to: '/' },
        { label: 'Trust & Safety', to: '/' },
        { label: 'Blog', to: '/' }
      ]
    }
  ]

  function subscribe() {
    if (email.value) {
      $q.notify({ type: 'positive', message: 'Subscribed successfully!' })
      email.value = ''
    }
  }
</script>