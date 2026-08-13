<template>
  <q-layout view="lHh LpR lff">
    <q-header elevated class="dashboard-header">
      <q-toolbar>
        <q-btn flat round dense icon="menu" class="q-mr-sm" @click="uiStore.toggleLeftDrawer" />
        <router-link to="/" class="logo-link">
          <div class="logo row items-center q-gutter-xs">
            <q-icon name="auto_awesome" size="22px" color="primary" />
            <span class="logo-text">Gig<span class="text-primary">Galaxy</span></span>
          </div>
        </router-link>
        <q-space />
        <q-btn flat round :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="$q.dark.toggle()" class="q-mr-xs" />
        <NotificationBell />
        <q-btn flat round class="q-ml-xs">
          <q-avatar size="34px" color="accent" text-color="white">
            <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
            <span v-else>{{ getInitials(authStore.user?.fullName || 'U') }}</span>
          </q-avatar>
          <q-menu anchor="bottom right" self="top right" :offset="[0, 8]">
            <q-list style="min-width:200px">
              <q-item>
                <q-item-section avatar>
                  <q-avatar size="38px" color="accent" text-color="white">
                    <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
                    <span v-else>{{ getInitials(authStore.user?.fullName || 'U') }}</span>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ authStore.user?.fullName }}</q-item-label>
                  <q-item-label caption class="text-accent">Client</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable to="/client/profile"><q-item-section avatar><q-icon name="person" /></q-item-section><q-item-section>My Profile</q-item-section></q-item>
              <q-item clickable to="/"><q-item-section avatar><q-icon name="home" /></q-item-section><q-item-section>Browse Marketplace</q-item-section></q-item>
              <q-separator />
              <q-item clickable @click="handleLogout">
                <q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section>
                <q-item-section class="text-negative">Sign Out</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="uiStore.leftDrawerOpen" :mini="uiStore.drawerMini && $q.screen.gt.sm" show-if-above :width="260" :mini-width="68" class="dashboard-drawer" bordered>
      <q-scroll-area class="fit">
        <div class="drawer-profile q-pa-md">
          <q-avatar size="48px" color="accent" text-color="white">
            <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
            <span v-else>{{ getInitials(authStore.user?.fullName || 'U') }}</span>
          </q-avatar>
          <template v-if="!uiStore.drawerMini">
            <div class="q-mt-sm">
              <div class="text-weight-bold text-subtitle2">{{ authStore.user?.fullName }}</div>
              <q-badge color="accent" class="q-mt-xs">Client</q-badge>
            </div>
          </template>
        </div>
        <q-separator />
        <q-list padding>
          <DrawerItem v-for="item in navItems" :key="item.to" :item="item" :mini="uiStore.drawerMini && $q.screen.gt.sm" />
        </q-list>
        <q-separator />
        <q-list padding>
          <DrawerItem :item="{ icon: 'logout', label: 'Sign Out', to: '', action: handleLogout }" :mini="uiStore.drawerMini && $q.screen.gt.sm" />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="dashboard-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useQuasar } from 'quasar'
  import { useAuthStore } from 'src/stores/auth.store'
  import { useUIStore } from 'src/stores/ui.store'
  import { getInitials } from 'src/utils/helpers'
  import NotificationBell from 'src/components/common/NotificationBell.vue'
  import DrawerItem from 'src/components/common/DrawerItem.vue'

  const router = useRouter()
  const $q = useQuasar()
  const authStore = useAuthStore()
  const uiStore = useUIStore()

  const navItems = [
    { icon: 'dashboard',     label: 'Dashboard',   to: '/client/dashboard' },
    { icon: 'receipt_long',  label: 'My Orders',   to: '/client/orders' },
    { icon: 'chat_bubble_outline', label: 'Messages', to: '/client/messages' },
    { icon: 'star_outline',  label: 'My Reviews',  to: '/client/reviews' },
    { icon: 'settings',      label: 'Profile & Settings', to: '/client/profile' }
  ]

  async function handleLogout() {
    await authStore.logout()
    router.push('/')
  }
</script>

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;
  .dashboard-header { background: white; color: $text-primary; border-bottom: 1px solid $border-color; .body--dark & { background: #16213e; border-bottom-color: $border-color-dark; color: white; } }
  .logo-link { text-decoration: none; }
  .logo-text { font-size: 1.2rem; font-weight: 800; color: $text-primary; .body--dark & { color: white; } }
  .dashboard-drawer { background: white; .body--dark & { background: #0d1b2a; } }
  .drawer-profile { padding-top: $spacing-lg; padding-bottom: $spacing-md; }
  .dashboard-content { background: $bg-light; .body--dark & { background: $bg-dark; } }
  .page-enter-active, .page-leave-active { transition: opacity 0.2s, transform 0.2s; }
  .page-enter-from { opacity: 0; transform: translateX(12px); }
  .page-leave-to   { opacity: 0; transform: translateX(-12px); }
</style>
