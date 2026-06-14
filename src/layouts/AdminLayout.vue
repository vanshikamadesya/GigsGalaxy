<template>
  <q-layout view="lHh LpR lff">
    <q-header elevated class="admin-header">
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="uiStore.toggleLeftDrawer" />
        <div class="logo row items-center q-gutter-xs q-ml-sm">
          <q-icon name="admin_panel_settings" size="22px" color="warning" />
          <span class="logo-text">Gig<span class="text-warning">Admin</span></span>
        </div>
        <q-space />
        <q-chip color="warning" text-color="dark" icon="shield" label="Admin Panel" dense class="gt-sm" />
        <q-space />
        <q-btn flat round :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="$q.dark.toggle()" />
        <NotificationBell />
        <q-btn flat round class="q-ml-xs">
          <q-avatar size="34px" color="warning" text-color="dark">
            <span>{{ getInitials(authStore.user?.fullName || 'A') }}</span>
          </q-avatar>
          <q-menu anchor="bottom right" self="top right">
            <q-list style="min-width:180px">
              <q-item><q-item-section><q-item-label class="text-weight-bold">{{ authStore.user?.fullName }}</q-item-label><q-item-label caption class="text-warning">Administrator</q-item-label></q-item-section></q-item>
              <q-separator />
              <q-item clickable @click="handleLogout"><q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section><q-item-section class="text-negative">Sign Out</q-item-section></q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="uiStore.leftDrawerOpen" :mini="uiStore.drawerMini && $q.screen.gt.sm" show-if-above :width="260" :mini-width="68" class="admin-drawer" bordered>
      <q-scroll-area class="fit">
        <div class="drawer-header q-pa-md row items-center q-gutter-sm" v-if="!uiStore.drawerMini">
          <q-icon name="admin_panel_settings" size="28px" color="warning" />
          <div>
            <div class="text-weight-bold">Admin Panel</div>
            <div class="text-caption text-warning">Full Access</div>
          </div>
        </div>
        <q-separator />
        <q-list padding>
          <template v-for="section in navSections" :key="section.label">
            <q-item-label v-if="!uiStore.drawerMini" header class="text-caption text-weight-bold q-mt-sm">
              {{ section.label }}
            </q-item-label>
            <DrawerItem v-for="item in section.items" :key="item.to" :item="item" :mini="uiStore.drawerMini && $q.screen.gt.sm" admin />
          </template>
        </q-list>
        <q-separator />
        <q-list padding>
          <DrawerItem :item="{ icon: 'logout', label: 'Sign Out', to: '', action: handleLogout }" :mini="uiStore.drawerMini && $q.screen.gt.sm" admin />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="admin-content">
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

  const navSections = [
    {
      label: 'OVERVIEW',
      items: [
        { icon: 'dashboard', label: 'Dashboard', to: '/admin/dashboard' },
        { icon: 'bar_chart', label: 'Reports', to: '/admin/reports' }
      ]
    },
    {
      label: 'USERS',
      items: [
        { icon: 'people', label: 'All Users', to: '/admin/users' },
        { icon: 'engineering', label: 'Freelancers', to: '/admin/freelancers' },
        { icon: 'person', label: 'Clients', to: '/admin/clients' }
      ]
    },
    {
      label: 'CONTENT',
      items: [
        { icon: 'work', label: 'Gig Moderation', to: '/admin/gigs' },
        { icon: 'category', label: 'Categories', to: '/admin/categories' }
      ]
    },
    {
      label: 'COMMERCE',
      items: [
        { icon: 'receipt_long', label: 'All Orders', to: '/admin/orders' }
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { icon: 'settings', label: 'Settings', to: '/admin/settings' }
      ]
    }
  ]

  async function handleLogout() {
    await authStore.logout()
    router.push('/')
  }
</script>

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;
  .admin-header { background: #1a0533; color: white; }
  .logo-text { font-size: 1.2rem; font-weight: 800; color: white; }
  .admin-drawer { background: #140428; .body--dark & { background: #0a0015; } }
  .admin-content { background: #f4f1ff; .body--dark & { background: #0f0a1e; } }
  .page-enter-active, .page-leave-active { transition: opacity 0.2s, transform 0.2s; }
  .page-enter-from { opacity: 0; transform: translateX(12px); }
  .page-leave-to   { opacity: 0; transform: translateX(-12px); }
</style>
