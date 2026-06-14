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
      <!-- BUG: class is 'gig-price-display' but the style only defines 'gig-price' — layout breaks -->
      <div class="gig-price-display">
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

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;

  .gig-card {
    border-radius: $radius-lg !important;
    overflow: hidden;
    transition: transform $transition-base, box-shadow $transition-base;

    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-xl !important;

      .gig-image { transform: scale(1.04); }
    }
  }

  .gig-image-wrap {
    position: relative;
    overflow: hidden;
  }

  .gig-image {
    transition: transform $transition-slow;
  }

  .gig-bookmark {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0,0,0,0.35) !important;
    backdrop-filter: blur(4px);
  }

  .gig-featured-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    border-radius: $radius-full !important;
  }

  .gig-title {
    font-size: $font-size-sm;
    font-weight: 600;
    color: $text-primary;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    .body--dark & { color: rgba(255,255,255,0.9); }
  }

  .gig-footer { padding: 10px 12px !important; }

  .gig-price {
    display: flex;
    align-items: baseline;
    gap: 3px;
  }

  .price-label {
    font-size: $font-size-xs;
    color: $text-muted;
  }

  .price-value {
    font-size: $font-size-lg;
    font-weight: 700;
    color: $primary;
  }
</style>
