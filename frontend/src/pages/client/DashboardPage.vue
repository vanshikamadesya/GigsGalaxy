<template>
  <q-page class="dashboard-page q-pa-lg">
    <!-- Welcome banner -->
    <div class="welcome-banner q-mb-xl">
      <div class="row items-center justify-between">
        <div>
          <h1 class="welcome-title">Hi, {{ authStore.user?.fullName?.split(' ')[0] }} 👋</h1>
          <p class="opacity-80">Let's find the perfect talent for your next project.</p>
        </div>
        <q-btn unelevated no-caps to="/gigs" label="Browse Gigs" icon="search" class="btn-client" />
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid q-mb-xl">
      <StatCard label="Active Orders" :value="stats.activeOrders || 0" icon="receipt_long" color="primary" :loading="statsLoading" />
      <StatCard label="Completed Orders" :value="stats.completedOrders || 0" icon="check_circle" color="positive" :loading="statsLoading" />
      <StatCard label="Total Spending" :value="stats.totalSpending || 0" icon="payments" color="secondary" type="currency" :loading="statsLoading" />
      <StatCard label="Reviews Given" :value="0" icon="star" color="warning" :loading="statsLoading" />
    </div>

    <div class="row q-col-gutter-xl">
      <!-- Active Orders -->
      <div class="col-12 col-md-8">
        <q-card class="gg-card q-pa-lg">
          <div class="row items-center justify-between q-mb-lg">
            <div class="text-subtitle1 text-weight-bold">Active Orders</div>
            <q-btn flat no-caps size="sm" to="/client/orders" label="View all" color="primary" />
          </div>
          <q-list separator>
            <q-item
              v-for="order in orderStore.activeOrders.slice(0, 5)"
              :key="order.id"
              clickable v-ripple
              :to="`/client/orders/${order.id}`"
            >
              <q-item-section avatar>
                <q-img :src="order.gig?.images?.[0]" style="width:44px;height:44px;border-radius:8px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium text-sm">{{ order.gig?.title }}</q-item-label>
                <q-item-label caption>{{ order.freelancer?.user?.fullName }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge :color="ORDER_STATUS_COLORS[order.status]" :label="ORDER_STATUS_LABELS[order.status]" />
                <div class="text-xs text-grey-5 q-mt-xs">${{ order.price }}</div>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-if="!orderStore.activeOrders.length" class="text-center q-py-xl text-grey-5">
            <q-icon name="receipt_long" size="36px" class="q-mb-sm" />
            <div>No active orders</div>
            <q-btn flat no-caps size="sm" to="/gigs" label="Browse gigs to get started" color="primary" class="q-mt-sm" />
          </div>
        </q-card>
      </div>

      <!-- Quick actions & Recommendations -->
      <div class="col-12 col-md-4">
        <q-card class="gg-card q-pa-lg q-mb-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Quick Actions</div>
          <q-list dense>
            <q-item clickable v-ripple to="/gigs" class="quick-action"><q-item-section avatar><q-icon name="search" color="primary" /></q-item-section><q-item-section>Find a Freelancer</q-item-section></q-item>
            <q-item clickable v-ripple to="/client/orders" class="quick-action"><q-item-section avatar><q-icon name="receipt_long" color="warning" /></q-item-section><q-item-section>Track Orders</q-item-section></q-item>
            <q-item clickable v-ripple to="/client/messages" class="quick-action">
              <q-item-section avatar><q-icon name="chat" color="info" /></q-item-section>
              <q-item-section>Messages</q-item-section>
              <q-item-section side>
                <q-badge v-if="chatStore.totalUnread" color="negative" :label="chatStore.totalUnread" />
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/freelancers" class="quick-action"><q-item-section avatar><q-icon name="people" color="positive" /></q-item-section><q-item-section>Browse Freelancers</q-item-section></q-item>
          </q-list>
        </q-card>

        <q-card class="gg-card q-pa-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Recommended Gigs</div>
          <div v-for="gig in recommendedGigs.slice(0,3)" :key="gig.id" class="rec-gig-item" @click="router.push(`/gigs/${gig.id}`)">
            <q-img :src="gig.images[0]" style="width:48px;height:48px;border-radius:8px;flex-shrink:0" />
            <div class="col q-ml-sm">
              <div class="text-sm text-weight-medium ellipsis">{{ gig.title }}</div>
              <div class="text-xs text-primary text-weight-bold">From ${{ Math.min(...gig.packages.map(p => p.price)) }}</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from 'src/stores/auth.store'
  import { useOrderStore } from 'src/stores/order.store'
  import { useChatStore } from 'src/stores/chat.store'
  import { dashboardService } from 'src/services/dashboard.service'
  import { gigService } from 'src/services/gig.service'
  import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from 'src/utils/constants'
  import type { DashboardStats, Gig } from 'src/types'
  import StatCard from 'src/components/common/StatCard.vue'

  const router = useRouter()
  const authStore = useAuthStore()
  const orderStore = useOrderStore()
  const chatStore = useChatStore()

  const stats = ref<DashboardStats>({ activeOrders: 0, completedOrders: 0 })
  const statsLoading = ref(true)
  const recommendedGigs = ref<Gig[]>([])

  onMounted(async () => {
    await Promise.all([
      dashboardService.getClientStats().then(s => { stats.value = s; statsLoading.value = false }),
      orderStore.fetchMyOrders('client'),
      gigService.getFeaturedGigs().then(g => { recommendedGigs.value = g })
    ])
  })
</script>

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;

  .dashboard-page { background: $bg-light; .body--dark & { background: $bg-dark; } }

  .welcome-banner {
    background: linear-gradient(135deg, #0f766e, #14b8a6);
    border-radius: $radius-xl;
    padding: $spacing-xl;
    color: white;
    .welcome-title { font-size: $font-size-2xl; font-weight: 700; margin: 0 0 4px; color: white; }
    p { margin: 0; }
  }

  .btn-client { background: white !important; color: #0f766e !important; border-radius: $radius-md !important; font-weight: 600 !important; }

  .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: $spacing-lg; @media (max-width: $bp-lg) { grid-template-columns: repeat(2,1fr); } @media (max-width: $bp-sm) { grid-template-columns: 1fr; } }

  .quick-action { border-radius: $radius-sm; margin: 2px 0; &:hover { background: rgba(91,33,182,0.04); } }

  .rec-gig-item { display: flex; align-items: center; padding: $spacing-sm 0; border-bottom: 1px solid $border-color; cursor: pointer; &:last-child { border-bottom: none; } &:hover { background: rgba(91,33,182,0.02); } .body--dark & { border-bottom-color: $border-color-dark; } }
</style>
