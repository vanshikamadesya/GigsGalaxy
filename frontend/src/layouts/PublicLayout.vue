<template>
  <q-layout view="hHh lpR fFf">
    <!-- ─── Header ─── -->
    <q-header
      class="public-header"
      :class="{ 'header-scrolled': isScrolled }"
      reveal
      elevated
    >
      <q-toolbar class="page-container toolbar-inner">
        <!-- Logo -->
        <router-link to="/" class="logo-link">
          <div class="logo">
            <q-icon name="auto_awesome" size="28px" class="logo-icon" />
            <span class="logo-text">Gig<span class="logo-accent">Galaxy</span></span>
          </div>
        </router-link>

        <q-space />

        <!-- Desktop Nav -->
        <nav class="desktop-nav gt-sm">
          <router-link to="/categories" class="nav-link">Categories</router-link>
          <router-link to="/freelancers" class="nav-link">Freelancers</router-link>
          <router-link to="/gigs" class="nav-link">Gigs</router-link>
        </nav>

        <q-space />

        <!-- Search -->
        <q-input
          v-model="searchQuery"
          dense
          rounded
          outlined
          placeholder="Search gigs or freelancers..."
          class="header-search gt-sm"
          @keyup.enter="goSearch"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-space />

        <!-- Actions -->
        <div class="header-actions row items-center q-gutter-sm">
          <!-- Dark Mode Toggle -->
          <q-btn flat round :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="toggleDark" />

          <template v-if="authStore.isAuthenticated">
            <!-- Notifications -->
            <NotificationBell />

            <!-- User Menu -->
            <q-btn flat round>
              <q-avatar size="36px" color="primary" text-color="white">
                <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
                <span v-else>{{ getInitials(authStore.user?.fullName || '') }}</span>
              </q-avatar>
              <q-menu>
                <q-list style="min-width: 180px">
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-weight-bold">{{ authStore.user?.fullName }}</q-item-label>
                      <q-item-label caption>{{ authStore.user?.email }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable :to="dashboardPath">
                    <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
                    <q-item-section>Dashboard</q-item-section>
                  </q-item>
                  <q-item clickable @click="handleLogout">
                    <q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section>
                    <q-item-section class="text-negative">Sign Out</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </template>

          <template v-else>
            <q-btn flat no-caps to="/auth/login" label="Sign In" class="text-weight-medium header-btn gt-sm" style="color: var(--gg-text) !important" />
            <q-btn
              unelevated
              no-caps
              to="/auth/register"
              label="Join Free"
              class="btn-primary gt-sm"
            />
          </template>

          <!-- Mobile Menu Button -->
          <q-btn flat round icon="menu" class="lt-md" @click="mobileDrawer = true" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Mobile Drawer -->
    <q-drawer v-model="mobileDrawer" side="right" overlay :width="280">
      <div class="mobile-menu q-pa-md">
        <div class="row justify-between items-center q-mb-md">
          <div class="logo">
            <q-icon name="auto_awesome" size="24px" class="logo-icon" />
            <span class="logo-text">GigGalaxy</span>
          </div>
          <q-btn flat round icon="close" @click="mobileDrawer = false" />
        </div>
        <q-list>
          <q-item clickable to="/" @click="mobileDrawer = false">
            <q-item-section avatar><q-icon name="home" /></q-item-section>
            <q-item-section>Home</q-item-section>
          </q-item>
          <q-item clickable to="/categories" @click="mobileDrawer = false">
            <q-item-section avatar><q-icon name="category" /></q-item-section>
            <q-item-section>Categories</q-item-section>
          </q-item>
          <q-item clickable to="/freelancers" @click="mobileDrawer = false">
            <q-item-section avatar><q-icon name="people" /></q-item-section>
            <q-item-section>Freelancers</q-item-section>
          </q-item>
          <q-item clickable to="/gigs" @click="mobileDrawer = false">
            <q-item-section avatar><q-icon name="work" /></q-item-section>
            <q-item-section>Gigs</q-item-section>
          </q-item>
          <q-separator class="q-my-sm" />
          <template v-if="!authStore.isAuthenticated">
            <q-item clickable to="/auth/login" @click="mobileDrawer = false">
              <q-item-section avatar><q-icon name="login" /></q-item-section>
              <q-item-section>Sign In</q-item-section>
            </q-item>
            <q-item clickable to="/auth/register" @click="mobileDrawer = false">
              <q-item-section avatar><q-icon name="person_add" /></q-item-section>
              <q-item-section>Join Free</q-item-section>
            </q-item>
          </template>
        </q-list>
      </div>
    </q-drawer>

    <!-- ─── Page Content ─── -->
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <!-- ─── Footer ─── -->
    <PublicFooter />
  </q-layout>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useQuasar } from 'quasar'
  import { useAuthStore } from 'src/stores/auth.store'
  import { getInitials } from 'src/utils/helpers'
  import NotificationBell from 'src/components/common/NotificationBell.vue'
  import PublicFooter from 'src/components/common/PublicFooter.vue'

  const $q = useQuasar()
  const router = useRouter()
  const authStore = useAuthStore()

  const searchQuery = ref('')
  const isScrolled = ref(false)
  const mobileDrawer = ref(false)

  const dashboardPath = computed(() => {
    switch (authStore.userRole) {
      case 'admin':      return '/admin/dashboard'
      case 'freelancer': return '/freelancer/dashboard'
      default:           return '/client/dashboard'
    }
  })

  function goSearch() {
    if (searchQuery.value.trim()) {
      router.push({ name: 'search', query: { q: searchQuery.value } })
    }
  }

  function toggleDark() {
    $q.dark.toggle()
  }

  async function handleLogout() {
    await authStore.logout()
    router.push('/')
  }

  function handleScroll() {
    isScrolled.value = window.scrollY > 20
  }

  onMounted(() => window.addEventListener('scroll', handleScroll))
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>