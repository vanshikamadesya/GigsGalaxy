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

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;

  .auth-layout {
    background: $bg-light;
    min-height: 100vh;
    .body--dark & { background: $bg-dark; }
  }

  .auth-page {
    min-height: 100vh;
    padding: $spacing-lg;
  }

  .auth-wrapper {
    display: flex;
    width: 100%;
    max-width: 1000px;
    min-height: 600px;
    border-radius: $radius-xl;
    overflow: hidden;
    box-shadow: $shadow-xl;
  }

  .auth-panel-left {
    flex: 1;
    background: $gradient-hero;
    padding: $spacing-2xl;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
  }

  .auth-panel-content {
    position: relative;
    z-index: 1;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;

    &-text {
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    &-accent { color: $secondary; }
  }

  .auth-features {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  .auth-feature-item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-sm;
    opacity: 0.9;
  }

  .floating-card {
    position: absolute;
    background: white;
    border-radius: $radius-md;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: $font-size-sm;
    font-weight: 600;
    box-shadow: $shadow-lg;
    animation: float 3s ease-in-out infinite;

    &.card-1 {
      bottom: 80px;
      left: 24px;
      animation-delay: 0s;
    }

    &.card-2 {
      bottom: 140px;
      right: 24px;
      animation-delay: 1.5s;
    }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-10px); }
  }

  .auth-panel-right {
    flex: 1;
    background: white;
    padding: $spacing-2xl;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-y: auto;

    .body--dark & {
      background: $surface-dark;
    }
  }

  @media (max-width: 767px) {
    .auth-wrapper {
      flex-direction: column;
      border-radius: $radius-lg;
    }

    .auth-panel-right {
      padding: $spacing-lg;
    }
  }
</style>
