<template>
  <q-card class="gg-card gig-list-item cursor-pointer" @click="router.push({ name: 'gig-detail', params: { id: gig.id } })">
    <q-card-section horizontal>
      <q-img :src="gig.images[0] || 'https://placehold.co/160x120/5B21B6/white?text=Gig'" style="width:160px;min-height:120px" />
      <q-card-section class="col q-pa-md">
        <div class="row items-start justify-between">
          <div class="col">
            <div class="gig-list-title q-mb-xs">{{ gig.title }}</div>
            <div class="row items-center q-gutter-sm q-mb-sm">
              <q-avatar size="22px" color="primary" text-color="white">
                <img v-if="gig.freelancer?.user?.avatar" :src="gig.freelancer.user.avatar" />
                <span v-else class="text-caption" style="font-size:9px">{{ getInitials(gig.freelancer?.user?.fullName || '') }}</span>
              </q-avatar>
              <span class="text-sm text-weight-medium">{{ gig.freelancer?.user?.fullName }}</span>
            </div>
            <StarRating :rating="gig.averageRating" :count="gig.totalReviews" size="13px" show-value />
          </div>
          <div class="text-right q-ml-md">
            <div class="text-caption text-grey">From</div>
            <div class="text-h6 text-weight-bold text-primary">${{ minPrice }}</div>
            <div class="text-caption text-grey">{{ minDelivery }}d delivery</div>
          </div>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { getInitials } from 'src/utils/helpers'
  import type { Gig } from 'src/types'
  import StarRating from './StarRating.vue'

  const props = defineProps<{ gig: Gig }>()
  const router = useRouter()

  const minPrice = computed(() => Math.min(...props.gig.packages.map(p => p.price)))
  const minDelivery = computed(() => Math.min(...props.gig.packages.map(p => p.deliveryTime)))
</script>