<template>
  <q-page class="gig-detail-page">
    <div v-if="loading" class="page-container q-py-xl">
      <div class="row q-gutter-xl">
        <div class="col-12 col-md-8">
          <div class="skeleton q-mb-md" style="height:400px;border-radius:16px" />
          <div class="skeleton q-mb-sm" style="height:32px;width:80%;border-radius:6px" />
          <div class="skeleton" style="height:20px;width:50%;border-radius:6px" />
        </div>
        <div class="col">
          <div class="skeleton" style="height:300px;border-radius:16px" />
        </div>
      </div>
    </div>

    <div v-else-if="gig" class="page-container q-py-xl">
      <div class="row q-col-gutter-xl">
        <!-- ── Left: Gig Content ── -->
        <div class="col-12 col-md-8">
          <!-- Breadcrumb -->
          <q-breadcrumbs class="q-mb-md text-sm">
            <q-breadcrumbs-el label="Home" to="/" />
            <q-breadcrumbs-el :label="gig.category" :to="`/categories/${gig.category}`" />
            <q-breadcrumbs-el :label="gig.title" />
          </q-breadcrumbs>

          <!-- Title -->
          <h1 class="gig-title q-mb-md">{{ gig.title }}</h1>

          <!-- Seller info -->
          <div class="seller-info-bar row items-center q-gutter-md q-mb-lg">
            <router-link :to="`/freelancers/${gig.freelancer?.user?.username}`" class="row items-center q-gutter-sm no-decoration">
              <q-avatar size="40px" color="primary" text-color="white">
                <img v-if="gig.freelancer?.user?.avatar" :src="gig.freelancer.user.avatar" />
                <span v-else>{{ getInitials(gig.freelancer?.user?.fullName || '') }}</span>
              </q-avatar>
              <div>
                <div class="text-weight-bold">{{ gig.freelancer?.user?.fullName }}</div>
                <div class="text-caption text-grey-6">@{{ gig.freelancer?.user?.username }}</div>
              </div>
            </router-link>
            <q-separator vertical />
            <StarRating :rating="gig.averageRating" :count="gig.totalReviews" size="14px" show-value />
            <q-separator vertical />
            <span class="text-sm text-grey-6">{{ gig.totalOrders }} orders completed</span>
          </div>

          <!-- Image carousel -->
          <q-carousel
            v-model="imageSlide"
            animated swipeable infinite
            class="gig-carousel q-mb-xl"
            arrows indicators
            control-color="white"
            :height="$q.screen.lt.md ? '220px' : '380px'"
          >
            <q-carousel-slide
              v-for="(img, i) in gig.images"
              :key="i"
              :name="i"
            >
              <q-img :src="img" fit="cover" class="full-height full-width" style="border-radius:12px" />
            </q-carousel-slide>
          </q-carousel>

          <!-- Description -->
          <div class="gig-section q-mb-xl">
            <h2 class="gig-section-title">About This Gig</h2>
            <p class="gig-description">{{ gig.description }}</p>
          </div>

          <!-- Tags -->
          <div class="q-mb-xl">
            <h2 class="gig-section-title">Tags</h2>
            <div class="row q-gutter-sm">
              <q-chip v-for="tag in gig.tags" :key="tag" dense color="purple-1" text-color="primary" :label="tag" />
            </div>
          </div>

          <!-- About the seller -->
          <div class="gig-section q-mb-xl" v-if="gig.freelancer">
            <h2 class="gig-section-title">About the Seller</h2>
            <div class="seller-card gg-card q-pa-lg">
              <div class="row q-gutter-lg">
                <div class="col-auto text-center">
                  <q-avatar size="80px" color="primary" text-color="white">
                    <img v-if="gig.freelancer.user?.avatar" :src="gig.freelancer.user.avatar" />
                    <span v-else class="text-h5">{{ getInitials(gig.freelancer.user?.fullName || '') }}</span>
                  </q-avatar>
                  <div class="q-mt-sm text-weight-bold">{{ gig.freelancer.user?.fullName }}</div>
                  <q-badge :color="getLevelColor(gig.freelancer.level)" class="q-mt-xs">{{ gig.freelancer.level }}</q-badge>
                </div>
                <div class="col">
                  <p class="text-grey-7 q-mb-md">{{ gig.freelancer.bio }}</p>
                  <div class="row q-gutter-lg">
                    <div><div class="text-weight-bold">{{ gig.freelancer.completedProjects }}</div><div class="text-caption text-grey">Projects</div></div>
                    <div><div class="text-weight-bold">{{ gig.freelancer.averageRating }}</div><div class="text-caption text-grey">Rating</div></div>
                    <div><div class="text-weight-bold">{{ gig.freelancer.responseTime }}</div><div class="text-caption text-grey">Response</div></div>
                  </div>
                </div>
              </div>
              <div class="row q-gutter-sm q-mt-md">
                <q-btn unelevated no-caps color="primary" label="View Profile" class="col" :to="`/freelancers/${gig.freelancer.user?.username}`" />
                <q-btn flat outline no-caps color="primary" icon="chat" label="Contact" class="col" @click="openChat" />
              </div>
            </div>
          </div>

          <!-- Reviews -->
          <div class="gig-section">
            <div class="row items-center justify-between q-mb-lg">
              <h2 class="gig-section-title q-mb-none">Reviews ({{ gig.totalReviews }})</h2>
              <StarRating :rating="gig.averageRating" size="18px" show-value />
            </div>

            <div v-for="review in reviews" :key="review.id" class="review-item q-mb-md">
              <div class="row items-start q-gutter-md">
                <q-avatar size="36px" color="accent" text-color="white">
                  <img v-if="review.client?.avatar" :src="review.client.avatar" />
                  <span v-else>{{ getInitials(review.client?.fullName || '') }}</span>
                </q-avatar>
                <div class="col">
                  <div class="row items-center q-gutter-sm">
                    <span class="text-weight-bold">{{ review.client?.fullName }}</span>
                    <StarRating :rating="review.rating" size="13px" />
                    <span class="text-xs text-grey">{{ timeAgo(review.createdAt) }}</span>
                  </div>
                  <p class="text-grey-7 q-mt-xs q-mb-sm">{{ review.comment }}</p>
                  <div v-if="review.reply" class="review-reply q-pa-sm q-ml-md">
                    <span class="text-weight-medium text-primary">Seller's response: </span>
                    {{ review.reply }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Right: Package & Order ── -->
        <div class="col-12 col-md-4">
          <div class="package-panel" style="position:sticky;top:80px">
            <!-- Package tabs -->
            <q-card class="gg-card">
              <q-tabs v-model="selectedPackage" dense align="justify" active-color="primary" indicator-color="primary">
                <q-tab name="basic" label="Basic" />
                <q-tab name="standard" label="Standard" />
                <q-tab name="premium" label="Premium" />
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="selectedPackage" animated>
                <q-tab-panel v-for="pkg in gig.packages" :key="pkg.name" :name="pkg.name" class="q-pa-lg">
                  <div class="row items-start justify-between q-mb-sm">
                    <div class="text-weight-bold text-subtitle1">{{ pkg.title }}</div>
                    <div class="text-h5 text-weight-bold text-primary">${{ pkg.price }}</div>
                  </div>
                  <p class="text-grey-6 text-sm q-mb-md">{{ pkg.description }}</p>

                  <div class="package-meta row q-gutter-lg q-mb-md">
                    <div class="row items-center q-gutter-xs">
                      <q-icon name="schedule" size="16px" color="grey-5" />
                      <span class="text-sm">{{ pkg.deliveryTime }} days delivery</span>
                    </div>
                    <div class="row items-center q-gutter-xs">
                      <q-icon name="refresh" size="16px" color="grey-5" />
                      <span class="text-sm">{{ pkg.revisions }} revisions</span>
                    </div>
                  </div>

                  <q-list dense class="q-mb-lg">
                    <q-item v-for="feat in pkg.features" :key="feat" dense class="q-pa-none">
                      <q-item-section avatar style="min-width:28px">
                        <q-icon name="check" size="16px" color="positive" />
                      </q-item-section>
                      <q-item-section class="text-sm">{{ feat }}</q-item-section>
                    </q-item>
                  </q-list>

                  <q-btn
                    unelevated no-caps
                    class="btn-primary full-width q-py-sm q-mb-sm"
                    :label="`Continue ($${pkg.price})`"
                    @click="placeOrder(pkg.name)"
                  />
                  <q-btn flat no-caps color="primary" class="full-width" icon="chat" label="Contact Seller" @click="openChat" />
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Dialog -->
    <q-dialog v-model="orderDialog" persistent>
      <q-card style="min-width:480px;max-width:95vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Place Your Order</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <p class="text-grey-6 q-mb-md">Please describe your requirements in detail.</p>
          <q-input
            v-model="requirementText"
            type="textarea"
            outlined dense
            placeholder="Describe exactly what you need, include any examples, links, or special requests..."
            :rows="5"
          />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat no-caps label="Cancel" v-close-popup />
          <q-btn unelevated no-caps label="Confirm Order" class="btn-primary" :loading="ordering" @click="confirmOrder" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useQuasar } from 'quasar'
  import { useGigStore } from 'src/stores/gig.store'
  import { useOrderStore } from 'src/stores/order.store'
  import { useAuthStore } from 'src/stores/auth.store'
  import { useChatStore } from 'src/stores/chat.store'
  import { reviewService } from 'src/services/review.service'
  import { getInitials, timeAgo } from 'src/utils/helpers'
  import { useNotify } from 'src/composables/useNotify'
  import type { Review } from 'src/types'
  import StarRating from 'src/components/common/StarRating.vue'

  const route = useRoute()
  const router = useRouter()
  const $q = useQuasar()
  const gigStore = useGigStore()
  const orderStore = useOrderStore()
  const authStore = useAuthStore()
  const chatStore = useChatStore()
  const notify = useNotify()

  const loading = ref(true)
  const imageSlide = ref(0)
  const selectedPackage = ref<'basic' | 'standard' | 'premium'>('basic')
  const orderDialog = ref(false)
  const ordering = ref(false)
  const requirementText = ref('')
  const reviews = ref<Review[]>([])

  const gig = ref(gigStore.currentGig)

  function getLevelColor(level: string) {
    const map: Record<string, string> = { new: 'grey', level_1: 'blue', level_2: 'purple', top_rated: 'orange' }
    return map[level] || 'grey'
  }

  function placeOrder(pkg: 'basic' | 'standard' | 'premium') {
    if (!authStore.isAuthenticated) { router.push('/auth/login'); return }
    if (authStore.isFreelancer) { notify.warning('Freelancers cannot place orders'); return }
    selectedPackage.value = pkg
    orderDialog.value = true
  }

  async function confirmOrder() {
    if (!requirementText.value.trim()) { notify.error('Please describe your requirements'); return }
    ordering.value = true
    try {
      const order = await orderStore.createOrder({
        gigId: gig.value!.id,
        packageType: selectedPackage.value,
        requirements: [{ question: 'Project requirements', answer: requirementText.value }]
      })
      orderDialog.value = false
      notify.success('Order placed successfully!')
      router.push(`/client/orders/${order.id}`)
    } catch {
      notify.error('Failed to place order')
    } finally {
      ordering.value = false
    }
  }

  async function openChat() {
    if (!authStore.isAuthenticated) { router.push('/auth/login'); return }
    await chatStore.openConversation(gig.value!.freelancerId)
    router.push(authStore.isClient ? '/client/messages' : '/freelancer/messages')
  }

  onMounted(async () => {
    const id = route.params.id as string
    await gigStore.fetchGigById(id)
    gig.value = gigStore.currentGig
    loading.value = false
    if (gig.value) {
      try {
        const result = await reviewService.getGigReviews(gig.value.id)
        reviews.value = result.data
      } catch { /* no reviews */ }
    }
  })
</script>

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;

  .gig-title {
    font-size: clamp(1.4rem, 3vw, 2rem);
    font-weight: 700;
    line-height: 1.3;
  }

  .seller-info-bar { padding: $spacing-md; background: $bg-light; border-radius: $radius-md; .body--dark & { background: rgba(255,255,255,0.05); } }
  .no-decoration { text-decoration: none; }

  .gig-carousel { border-radius: $radius-lg !important; overflow: hidden; }

  .gig-section-title { font-size: $font-size-xl; font-weight: 700; margin-bottom: $spacing-md; }

  .gig-description { font-size: $font-size-base; line-height: 1.8; color: $text-secondary; white-space: pre-wrap; }

  .review-item { padding-bottom: $spacing-md; border-bottom: 1px solid $border-color; .body--dark & { border-bottom-color: $border-color-dark; } }

  .review-reply {
    background: rgba(91,33,182,0.04);
    border-left: 3px solid $primary;
    border-radius: 0 $radius-sm $radius-sm 0;
    font-size: $font-size-sm;
  }
</style>
