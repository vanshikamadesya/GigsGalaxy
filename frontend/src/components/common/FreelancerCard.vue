<template>
  <q-card class="fl-card gg-card cursor-pointer" @click="goToProfile">
    <q-card-section class="fl-card-body">
      <!-- Avatar + Online -->
      <div class="fl-avatar-wrap q-mb-md">
        <q-avatar size="72px" color="primary" text-color="white" class="fl-avatar">
          <img v-if="profile.user?.avatar" :src="profile.user.avatar" />
          <span v-else class="text-h6">{{ getInitials(profile.user?.fullName || '') }}</span>
        </q-avatar>
        <div v-if="isOnline" class="online-dot" />
      </div>

      <!-- Info -->
      <div class="text-center q-mb-sm">
        <div class="fl-name">{{ profile.user?.fullName }}</div>
        <div class="fl-tagline text-grey-6">{{ profile.tagline || 'Freelancer' }}</div>
      </div>

      <!-- Rating -->
      <div class="row justify-center q-mb-sm">
        <StarRating :rating="profile.averageRating" :count="profile.totalReviews" size="14px" show-value />
      </div>

      <!-- Skills -->
      <div class="fl-skills row justify-center q-gutter-xs q-mb-md">
        <q-chip
          v-for="skill in profile.skills.slice(0,3)"
          :key="skill"
          dense
          color="purple-1"
          text-color="primary"
          :label="skill"
          size="sm"
          class="fl-skill-chip"
        />
        <q-chip v-if="profile.skills.length > 3" dense color="grey-2" text-color="grey-7" :label="`+${profile.skills.length - 3}`" size="sm" />
      </div>

      <!-- Stats row -->
      <div class="fl-stats row justify-around q-mb-md">
        <div class="text-center">
          <div class="fl-stat-value">{{ profile.completedProjects }}</div>
          <div class="fl-stat-label">Projects</div>
        </div>
        <q-separator vertical />
        <div class="text-center">
          <div class="fl-stat-value">{{ profile.responseTime || '1h' }}</div>
          <div class="fl-stat-label">Response</div>
        </div>
        <q-separator vertical />
        <div class="text-center">
          <div class="fl-stat-value">${{ profile.hourlyRate }}/hr</div>
          <div class="fl-stat-label">Rate</div>
        </div>
      </div>

      <!-- Actions -->
      <div class="row q-gutter-sm">
        <q-btn
          unelevated no-caps
          color="primary"
          label="Hire Now"
          class="col"
          @click.stop="goToProfile"
        />
        <q-btn
          flat no-caps
          outline
          color="primary"
          icon="chat"
          @click.stop="chat"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useChatStore } from 'src/stores/chat.store'
  import { useAuthStore } from 'src/stores/auth.store'
  import { getInitials } from 'src/utils/helpers'
  import type { FreelancerProfile } from 'src/types'
  import StarRating from './StarRating.vue'

  const props = defineProps<{ profile: FreelancerProfile; onlineUsers?: Set<string> }>()
  const router = useRouter()
  const chatStore = useChatStore()
  const authStore = useAuthStore()

  const isOnline = computed(() => props.onlineUsers?.has(props.profile.userId) ?? false)

  function goToProfile() {
    router.push({ name: 'freelancer-profile', params: { username: props.profile.user?.username } })
  }

  async function chat() {
    if (!authStore.isAuthenticated) { router.push('/auth/login'); return }
    await chatStore.openConversation(props.profile.userId)
    const path = authStore.isClient ? '/client/messages' : '/freelancer/messages'
    router.push(path)
  }
</script>