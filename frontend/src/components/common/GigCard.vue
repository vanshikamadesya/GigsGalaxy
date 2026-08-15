<template>
  <q-card class="gig-card gg-card cursor-pointer" @click="goToGig">
    <!-- Image -->
    <div class="gig-image-wrap">
      <q-img
        :src="gig.images[0] || 'https://placehold.co/400x240/5B21B6/white?text=Gig'"
        :ratio="16/9"
        class="gig-image"
      >
        <template #loading>
          <div class="skeleton" style="width:100%;height:100%" />
        </template>
      </q-img>

      <!-- Bookmark -->
      <q-btn
        flat round
        :icon="isBookmarked ? 'bookmark' : 'bookmark_border'"
        :color="isBookmarked ? 'primary' : 'white'"
        class="gig-bookmark"
        size="sm"
        @click.stop="handleBookmark"
      />

      <!-- Status badge -->
      <q-badge
        v-if="gig.isFeatured"
        color="warning"
        class="gig-featured-badge"
        label="Featured"
      />
    </div>

    <!-- Freelancer -->
    <q-card-section class="q-pb-xs">
      <div class="row items-center q-gutter-sm">
        <q-avatar size="28px" color="primary" text-color="white">
          <img v-if="gig.freelancer?.user?.avatar" :src="gig.freelancer.user.avatar" />
          <span v-else class="text-caption">{{ getInitials(gig.freelancer?.user?.fullName || '') }}</span>
        </q-avatar>
        <div>
          <div class="text-caption text-weight-medium">{{ gig.freelancer?.user?.fullName }}</div>
          <StarRating :rating="gig.freelancer?.averageRating || 0" :count="gig.freelancer?.totalReviews" size="11px" />
        </div>
        <q-space />
        <q-chip
          v-if="gig.freelancer?.level"
          dense
          :color="getLevelColor(gig.freelancer.level)"
          text-color="white"
          :label="getLevelLabel(gig.freelancer.level)"
          size="xs"
        />
      </div>
    </q-card-section>

    <q-card-section class="q-pt-xs q-pb-xs">
      <div class="gig-title">{{ gig.title }}</div>
    </q-card-section>

    <q-card-section class="q-pt-xs">
      <StarRating :rating="gig.averageRating" :count="gig.totalReviews" size="13px" show-value />
    </q-card-section>

    <q-separator />

    <q-card-actions class="gig-footer row items-center justify-between q-pa-sm">
      <div class="row items-center q-gutter-xs text-grey-6">
        <q-icon name="schedule" size="14px" />
        <span class="text-xs">{{ minDelivery }}d delivery</span>
      </div>
      <div class="gig-price">
        <span class="price-label">From</span>
        <span class="price-value">${{ minPrice }}</span>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useGigStore } from 'src/stores/gig.store'
  import { useAuthStore } from 'src/stores/auth.store'
  import { getInitials } from 'src/utils/helpers'
  import type { Gig } from 'src/types'
  import StarRating from './StarRating.vue'

  const props = defineProps<{ gig: Gig }>()
  const router = useRouter()
  const gigStore = useGigStore()
  const authStore = useAuthStore()

  const isBookmarked = computed(() => gigStore.bookmarkedGigs.some(g => g.id === props.gig.id))
  const minPrice = computed(() => Math.min(...props.gig.packages.map(p => p.price)))
  const minDelivery = computed(() => Math.min(...props.gig.packages.map(p => p.deliveryTime)))

  function goToGig() {
    router.push({ name: 'gig-detail', params: { id: props.gig.id } })
  }

  async function handleBookmark(e: Event) {
    e.stopPropagation()
    if (!authStore.isAuthenticated) {
      router.push('/auth/login')
      return
    }
    await gigStore.toggleBookmark(props.gig.id)
  }

  function getLevelColor(level: string) {
    const map: Record<string, string> = { new: 'grey', level_1: 'blue', level_2: 'purple', top_rated: 'orange' }
    return map[level] || 'grey'
  }

  function getLevelLabel(level: string) {
    const map: Record<string, string> = { new: 'New', level_1: 'Level 1', level_2: 'Level 2', top_rated: '⭐ Top' }
    return map[level] || level
  }
</script>