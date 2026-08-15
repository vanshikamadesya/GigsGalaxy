<template>
  <q-layout view="lHh LpR lff">
    <!-- ─── Header ─── -->
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

        <!-- Search bar -->
        <q-input
          dense rounded outlined placeholder="Search..."
          class="header-search gt-sm q-mr-md"
          style="width:220px"
        >
          <template #prepend><q-icon name="search" size="18px" /></template>
        </q-input>

        <q-space />

        <!-- Dark mode -->
        <q-btn flat round :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="$q.dark.toggle()" class="q-mr-xs" />

        <!-- Notifications -->
        <NotificationBell />

        <!-- Avatar menu -->
        <q-btn flat round class="q-ml-xs">
          <q-avatar size="34px" color="primary" text-color="white" class="cursor-pointer">
            <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
            <span v-else class="text-caption">{{ getInitials(authStore.user?.fullName || 'U') }}</span>
          </q-avatar>
          <q-menu anchor="bottom right" self="top right" :offset="[0, 8]">
            <q-list style="min-width:200px">
              <q-item>
                <q-item-section avatar>
                  <q-avatar size="38px" color="primary" text-color="white">
                    <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
                    <span v-else>{{ getInitials(authStore.user?.fullName || 'U') }}</span>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ authStore.user?.fullName }}</q-item-label>
                  <q-item-label caption class="text-primary">Freelancer</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable to="/freelancer/profile"><q-item-section avatar><q-icon name="person" /></q-item-section><q-item-section>My Profile</q-item-section></q-item>
              <q-item clickable to="/"><q-item-section avatar><q-icon name="home" /></q-item-section><q-item-section>Public Home</q-item-section></q-item>
              <q-separator />
              <q-item clickable @click="handleLogout" class="text-negative">
                <q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section>
                <q-item-section>Sign Out</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- ─── Left Drawer ─── -->
    <q-drawer
      v-model="uiStore.leftDrawerOpen"
      :mini="uiStore.drawerMini && $q.screen.gt.sm"
      show-if-above
      :width="260"
      :mini-width="68"
      class="dashboard-drawer"
      bordered
    >
      <!-- Mini toggle -->
      <div class="drawer-toggle-btn gt-sm">
        <q-btn flat round :icon="uiStore.drawerMini ? 'chevron_right' : 'chevron_left'" size="sm" @click="uiStore.toggleDrawerMini" />
      </div>

      <q-scroll-area class="fit">
        <!-- Profile Summary -->
        <div class="drawer-profile q-pa-md" :class="{ 'text-center': uiStore.drawerMini }">
          <q-avatar size="48px" color="primary" text-color="white">
            <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" />
            <span v-else>{{ getInitials(authStore.user?.fullName || 'U') }}</span>
          </q-avatar>
          <template v-if="!uiStore.drawerMini">
            <div class="q-mt-sm">
              <div class="text-weight-bold text-subtitle2">{{ authStore.user?.fullName }}</div>
              <q-badge color="secondary" class="q-mt-xs">Freelancer</q-badge>
            </div>
          </template>
        </div>

        <q-separator />

        <q-list padding>
          <DrawerItem
            v-for="item in navItems"
            :key="item.to"
            :item="item"
            :mini="uiStore.drawerMini && $q.screen.gt.sm"
          />
        </q-list>

        <q-separator class="q-mt-auto" />

        <q-list padding>
          <DrawerItem
            :item="{ icon: 'logout', label: 'Sign Out', to: '', action: handleLogout }"
            :mini="uiStore.drawerMini && $q.screen.gt.sm"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- ─── Page Content ─── -->
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
    { icon: 'dashboard',     label: 'Dashboard',   to: '/freelancer/dashboard' },
    { icon: 'work_outline',  label: 'My Gigs',      to: '/freelancer/gigs' },
    { icon: 'collections',   label: 'Portfolio',    to: '/freelancer/portfolio' },
    { icon: 'receipt_long',  label: 'Orders',       to: '/freelancer/orders' },
    { icon: 'chat_bubble_outline', label: 'Messages', to: '/freelancer/messages' },
    { icon: 'account_balance_wallet', label: 'Wallet', to: '/freelancer/wallet' },
    { icon: 'star_outline',  label: 'Reviews',      to: '/freelancer/reviews' },
    { icon: 'settings',      label: 'Profile & Settings', to: '/freelancer/profile' }
  ]

  async function handleLogout() {
    await authStore.logout()
    router.push('/')
  }
</script>