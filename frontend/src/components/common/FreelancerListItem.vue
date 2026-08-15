<template>
  <q-card class="gg-card freelancer-list-item cursor-pointer" @click="router.push({ name: 'freelancer-profile', params: { username: profile.user?.username } })">
    <q-card-section horizontal>
      <q-avatar size="80px" color="primary" text-color="white" class="fl-list-avatar">
        <img v-if="profile.user?.avatar" :src="profile.user.avatar" />
        <span v-else class="text-h6">{{ getInitials(profile.user?.fullName || '') }}</span>
      </q-avatar>

      <q-card-section class="col q-pa-md">
        <div class="row items-start justify-between">
          <div class="col">
            <div class="fl-list-title q-mb-xs">{{ profile.user?.fullName }}</div>
            <div class="text-sm text-grey-6 q-mb-sm">{{ profile.tagline || 'Freelancer' }}</div>

            <div class="row items-center q-gutter-sm q-mb-sm">
              <StarRating :rating="profile.averageRating" :count="profile.totalReviews" size="13px" show-value />
            </div>

            <div class="row q-gutter-xs q-mt-sm fl-list-skills">
              <q-chip
                v-for="skill in profile.skills.slice(0,4)"
                :key="skill"
                dense
                color="purple-1"
                text-color="primary"
                :label="skill"
                size="sm"
              />
              <q-chip v-if="profile.skills.length > 4" dense color="grey-2" text-color="grey-7" :label="`+${profile.skills.length - 4}`" size="sm" />
            </div>
          </div>

          <div class="text-right q-ml-md fl-list-meta">
            <div class="text-caption text-grey">Rate</div>
            <div class="text-h6 text-weight-bold text-primary">${{ profile.hourlyRate || 0 }}/hr</div>
            <div class="text-caption text-grey q-mt-sm">{{ profile.user?.country || 'Worldwide' }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getInitials } from 'src/utils/helpers'
import type { FreelancerProfile } from 'src/types'
import StarRating from './StarRating.vue'

const props = defineProps<{ profile: FreelancerProfile; onlineUsers?: Set<string> }>()
const router = useRouter()

</script>
