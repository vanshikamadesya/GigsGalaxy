<template>
  <q-layout view="lHh lpr lFf" class="auth-layout">
    <q-page-container>
      <q-page class="auth-page flex flex-center">
        <div class="auth-wrapper">
          <!-- Left Panel (decorative) -->
          <div class="auth-panel-left gt-sm">
            <div class="auth-panel-content">
              <router-link to="/" class="logo-link">
                <div class="logo q-mb-xl">
                  <q-icon name="auto_awesome" size="40px" color="white" />
                  <span class="logo-text text-white">Gig<span class="logo-accent">Galaxy</span></span>
                </div>
              </router-link>
              <h2 class="text-white q-mb-md">Find World-Class Talent</h2>
              <p class="text-white opacity-80 q-mb-xl">
                Connect with skilled freelancers for any project. Fast, reliable, and affordable.
              </p>
              <div class="auth-features">
                <div v-for="feat in features" :key="feat.text" class="auth-feature-item">
                  <q-icon :name="feat.icon" size="20px" color="white" />
                  <span class="text-white">{{ feat.text }}</span>
                </div>
              </div>
              <!-- Floating cards -->
              <div class="floating-card card-1">
                <q-icon name="star" color="warning" size="16px" />
                <span>4.9 Average Rating</span>
              </div>
              <div class="floating-card card-2">
                <q-icon name="people" color="primary" size="16px" />
                <span>50k+ Freelancers</span>
              </div>
            </div>
          </div>

          <!-- Right Panel (form) -->
          <div class="auth-panel-right">
            <!-- Mobile Logo -->
            <router-link to="/" class="logo-link lt-md q-mb-xl" style="display:block">
              <div class="logo row items-center justify-center">
                <q-icon name="auto_awesome" size="28px" class="text-primary" />
                <span class="logo-text q-ml-sm">Gig<span class="logo-accent">Galaxy</span></span>
              </div>
            </router-link>

            <router-view />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  const features = [
    { icon: 'verified_user', text: 'Verified Freelancers' },
    { icon: 'security', text: 'Secure Payments' },
    { icon: 'support_agent', text: '24/7 Support' },
    { icon: 'money_off', text: 'No Hidden Fees' }
  ]
</script>