<template>
  <q-page class="q-pa-lg">
    <h1 class="text-h5 text-weight-bold q-mb-xl">My Reviews</h1>

    <!-- Rating summary -->
    <q-card class="gg-card q-pa-xl q-mb-xl">
      <div class="row items-center q-gutter-xl">
        <div class="text-center">
          <div class="text-h2 text-weight-black text-primary">{{ avgRating.toFixed(1) }}</div>
          <StarRating :rating="avgRating" size="20px" class="q-mb-xs" />
          <div class="text-grey-6">{{ reviews.length }} reviews</div>
        </div>
        <div class="col">
          <div v-for="r in [5,4,3,2,1]" :key="r" class="row items-center q-gutter-sm q-mb-xs">
            <span class="text-sm" style="width:10px">{{ r }}</span>
            <q-icon name="star" color="warning" size="14px" />
            <q-linear-progress :value="getRatingPercent(r)" color="warning" class="col" style="border-radius:4px;height:8px" />
            <span class="text-sm text-grey-6" style="width:30px">{{ getRatingCount(r) }}</span>
          </div>
        </div>
      </div>
    </q-card>

    <!-- Reviews list -->
    <div v-for="review in reviews" :key="review.id" class="review-item gg-card q-pa-lg q-mb-md">
      <div class="row items-start q-gutter-md">
        <q-avatar size="44px" color="accent" text-color="white">{{ getInitials(review.client?.fullName || '') }}</q-avatar>
        <div class="col">
          <div class="row items-center q-gutter-sm q-mb-xs">
            <span class="text-weight-bold">{{ review.client?.fullName }}</span>
            <StarRating :rating="review.rating" size="13px" />
            <span class="text-xs text-grey-5">{{ timeAgo(review.createdAt) }}</span>
          </div>
          <p class="text-grey-7 q-mb-sm">{{ review.comment }}</p>

          <!-- Reply form -->
          <div v-if="review.reply" class="review-reply q-pa-sm">
            <span class="text-weight-medium text-primary text-sm">Your response: </span>
            <span class="text-grey-7">{{ review.reply }}</span>
          </div>
          <div v-else>
            <q-btn flat no-caps size="sm" icon="reply" label="Reply" color="primary" @click="openReply(review.id)" />
          </div>
          <div v-if="replyingTo === review.id" class="q-mt-sm">
            <q-input v-model="replyText" outlined dense :rows="2" type="textarea" placeholder="Write a professional response..." />
            <div class="row q-gutter-sm q-mt-sm">
              <q-btn unelevated no-caps size="sm" class="btn-primary" label="Submit Reply" :loading="replying" @click="submitReply(review.id)" />
              <q-btn flat no-caps size="sm" label="Cancel" @click="replyingTo = null" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!reviews.length" class="text-center q-py-3xl text-grey-5">
      <q-icon name="star_border" size="64px" class="q-mb-md" />
      <h3>No reviews yet</h3>
      <p>Complete orders to start receiving reviews</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { reviewService } from 'src/services/review.service'
  import { useAuthStore } from 'src/stores/auth.store'
  import { useNotify } from 'src/composables/useNotify'
  import { getInitials, timeAgo } from 'src/utils/helpers'
  import type { Review } from 'src/types'
  import StarRating from 'src/components/common/StarRating.vue'

  const authStore = useAuthStore()
  const notify = useNotify()

  const reviews = ref<Review[]>([])
  const replyingTo = ref<string | null>(null)
  const replyText = ref('')
  const replying = ref(false)

  const avgRating = computed(() => {
    if (!reviews.value.length) return 0
    return reviews.value.reduce((s, r) => s + r.rating, 0) / reviews.value.length
  })

  function getRatingCount(r: number) {
    return reviews.value.filter(rv => rv.rating === r).length
  }

  function getRatingPercent(r: number): number {
    if (!reviews.value.length) return 0
    return getRatingCount(r) / reviews.value.length
  }

  function openReply(id: string) {
    replyingTo.value = id
    replyText.value = ''
  }

  async function submitReply(id: string) {
    replying.value = true
    try {
      await reviewService.replyToReview(id, replyText.value)
      const review = reviews.value.find(r => r.id === id)
      if (review) { review.reply = replyText.value }
      replyingTo.value = null
      notify.success('Reply submitted')
    } catch { notify.error('Failed to submit reply') }
    finally { replying.value = false }
  }

  onMounted(async () => {
    const res = await reviewService.getFreelancerReviews(authStore.user?.id || '')
    reviews.value = res.data
  })
</script>