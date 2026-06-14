<template>
  <div>
    <q-btn flat round icon="notifications" @click="open = true">
      <q-badge v-if="notifStore.hasUnread" color="negative" floating rounded>
        {{ notifStore.unreadCount > 9 ? '9+' : notifStore.unreadCount }}
      </q-badge>
    </q-btn>

    <q-dialog v-model="open" position="top" transition-show="slide-down" transition-hide="slide-up">
      <q-card style="width:380px; max-width:95vw; max-height:70vh; overflow:hidden" class="notif-panel">
        <!-- Header -->
        <div class="notif-header row items-center justify-between q-pa-md">
          <div class="text-weight-bold text-subtitle1">Notifications</div>
          <div class="row items-center q-gutter-sm">
            <q-btn flat dense no-caps size="sm" label="Mark all read" @click="notifStore.markAllAsRead()" :disable="!notifStore.hasUnread" />
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
        </div>

        <q-separator />

        <!-- List -->
        <q-scroll-area style="height:400px">
          <q-list separator>
            <q-item
              v-for="notif in notifStore.notifications"
              :key="notif.id"
              clickable
              v-ripple
              :class="{ 'notif-unread': !notif.isRead }"
              @click="handleClick(notif)"
            >
              <q-item-section avatar top>
                <q-avatar :color="getNotifColor(notif.type)" text-color="white" size="36px">
                  <q-icon :name="getNotifIcon(notif.type)" size="18px" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ notif.title }}</q-item-label>
                <q-item-label caption>{{ notif.message }}</q-item-label>
                <q-item-label caption class="text-muted">{{ timeAgo(notif.createdAt) }}</q-item-label>
              </q-item-section>
              <q-item-section side v-if="!notif.isRead">
                <div class="unread-dot" />
              </q-item-section>
            </q-item>

            <div v-if="!notifStore.notifications.length" class="q-pa-xl text-center text-grey">
              <q-icon name="notifications_none" size="48px" class="q-mb-sm" />
              <div>No notifications yet</div>
            </div>
          </q-list>
        </q-scroll-area>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useNotificationStore } from 'src/stores/notification.store'
  import { timeAgo } from 'src/utils/helpers'
  import type { Notification, NotificationType } from 'src/types'

  const notifStore = useNotificationStore()
  const router = useRouter()
  const open = ref(false)

  onMounted(() => {
    notifStore.fetchNotifications()
    notifStore.fetchUnreadCount()
  })

  function getNotifIcon(type: NotificationType): string {
    const map: Record<NotificationType, string> = {
      new_order: 'shopping_cart',
      order_accepted: 'check_circle',
      project_delivered: 'inventory',
      payment_released: 'payments',
      new_message: 'chat',
      review_received: 'star',
      gig_approved: 'verified',
      gig_rejected: 'cancel'
    }
    return map[type] || 'notifications'
  }

  function getNotifColor(type: NotificationType): string {
    const map: Record<NotificationType, string> = {
      new_order: 'primary',
      order_accepted: 'positive',
      project_delivered: 'teal',
      payment_released: 'positive',
      new_message: 'info',
      review_received: 'warning',
      gig_approved: 'positive',
      gig_rejected: 'negative'
    }
    return map[type] || 'grey'
  }

  async function handleClick(notif: Notification) {
    if (!notif.isRead) await notifStore.markAsRead(notif.id)
    open.value = false
    if (notif.actionUrl) router.push(notif.actionUrl)
  }
</script>

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;

  .notif-panel {
    border-radius: $radius-lg !important;
    box-shadow: $shadow-xl !important;
  }

  .notif-header {
    background: white;
    .body--dark & { background: $surface-dark; }
  }

  .notif-unread {
    background: rgba(91, 33, 182, 0.04);
    .body--dark & { background: rgba(139, 92, 246, 0.08); }
  }

  .unread-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $primary;
  }
</style>
