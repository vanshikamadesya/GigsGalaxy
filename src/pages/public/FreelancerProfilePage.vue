<template>
  <q-page class="q-py-xl">
    <div class="page-container">
      <div v-if="loading" class="row q-gutter-xl">
        <div class="col-12 col-md-3">
          <div class="skeleton" style="height:400px;border-radius:16px" />
        </div>
        <div class="col">
          <div class="skeleton q-mb-md" style="height:32px;width:60%;border-radius:6px" />
          <div class="skeleton q-mb-sm" style="height:16px;width:80%;border-radius:6px" />
          <div class="skeleton" style="height:16px;width:50%;border-radius:6px" />
        </div>
      </div>

      <div v-else-if="profile" class="row q-col-gutter-xl">
        <!-- Sidebar -->
        <div class="col-12 col-md-3">
          <q-card class="gg-card q-pa-lg text-center profile-sidebar" style="position:sticky;top:80px">
            <q-avatar size="100px" color="primary" text-color="white" class="q-mb-md profile-avatar">
              <img v-if="profile.user?.avatar" :src="profile.user.avatar" />
              <span v-else class="text-h4">{{ getInitials(profile.user?.fullName || '') }}</span>
            </q-avatar>
            <div class="text-h6 text-weight-bold">{{ profile.user?.fullName }}</div>
            <div class="text-grey-6 text-sm q-mb-xs">@{{ profile.user?.username }}</div>
            <q-badge :color="getLevelColor(profile.level)" class="q-mb-md">{{ getLevelLabel(profile.level) }}</q-badge>

            <q-separator class="q-my-md" />

            <div class="profile-stats q-gutter-y-sm">
              <div class="stat-row row items-center justify-between">
                <span class="text-sm text-grey-6"><q-icon name="star" size="14px" color="warning" /> Rating</span>
                <span class="text-weight-bold">{{ profile.averageRating }} ({{ profile.totalReviews }})</span>
              </div>
              <div class="stat-row row items-center justify-between">
                <span class="text-sm text-grey-6"><q-icon name="check_circle" size="14px" color="positive" /> Completed</span>
                <span class="text-weight-bold">{{ profile.completedProjects }}</span>
              </div>
              <div class="stat-row row items-center justify-between">
                <span class="text-sm text-grey-6"><q-icon name="reply" size="14px" color="info" /> Response</span>
                <span class="text-weight-bold">{{ profile.responseTime }}</span>
              </div>
              <div class="stat-row row items-center justify-between">
                <span class="text-sm text-grey-6"><q-icon name="location_on" size="14px" color="grey-5" /> Location</span>
                <span class="text-weight-bold">{{ profile.user?.country || 'Worldwide' }}</span>
              </div>
              <div class="stat-row row items-center justify-between">
                <span class="text-sm text-grey-6"><q-icon name="calendar_today" size="14px" color="grey-5" /> Member</span>
                <span class="text-weight-bold">{{ formatDate(profile.memberSince) }}</span>
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="row q-gutter-sm">
              <q-btn unelevated no-caps color="primary" label="Hire Me" class="col" @click="goHire" />
              <q-btn flat outline no-caps color="primary" icon="chat" @click="openChat" />
            </div>

            <!-- Skills -->
            <q-separator class="q-my-md" />
            <div class="text-left">
              <div class="text-weight-bold text-sm q-mb-sm">Skills</div>
              <div class="row q-gutter-xs">
                <q-chip v-for="skill in profile.skills" :key="skill" dense color="purple-1" text-color="primary" :label="skill" size="sm" />
              </div>
            </div>

            <!-- Languages -->
            <q-separator class="q-my-md" />
            <div class="text-left">
              <div class="text-weight-bold text-sm q-mb-sm">Languages</div>
              <div v-for="lang in profile.languages" :key="lang.language" class="row items-center justify-between text-sm q-mb-xs">
                <span>{{ lang.language }}</span>
                <q-badge color="grey-3" text-color="grey-7" :label="lang.proficiency" />
              </div>
            </div>
          </q-card>
        </div>

        <!-- Main content -->
        <div class="col-12 col-md-9">
          <!-- Tabs -->
          <q-tabs v-model="tab" class="q-mb-xl" active-color="primary" indicator-color="primary" align="left" dense>
            <q-tab name="about" label="About" />
            <q-tab name="gigs" :label="`Gigs (${gigs.length})`" />
            <q-tab name="portfolio" :label="`Portfolio (${portfolio.length})`" />
            <q-tab name="reviews" :label="`Reviews (${profile.totalReviews})`" />
          </q-tabs>

          <q-tab-panels v-model="tab" animated>
            <!-- About -->
            <q-tab-panel name="about" class="q-pa-none">
              <h2 class="text-h6 text-weight-bold q-mb-sm">{{ profile.tagline }}</h2>
              <p class="text-grey-7 q-mb-xl" style="white-space:pre-wrap;line-height:1.8">{{ profile.bio }}</p>

              <!-- Education -->
              <div v-if="profile.education?.length" class="q-mb-xl">
                <h3 class="text-subtitle1 text-weight-bold q-mb-md">Education</h3>
                <q-timeline color="primary">
                  <q-timeline-entry v-for="edu in profile.education" :key="edu.institution"
                    :title="edu.degree" :subtitle="edu.institution" :side="'right'">
                    {{ edu.fieldOfStudy }} · {{ edu.from }} - {{ edu.to || 'Present' }}
                  </q-timeline-entry>
                </q-timeline>
              </div>

              <!-- Certifications -->
              <div v-if="profile.certifications?.length">
                <h3 class="text-subtitle1 text-weight-bold q-mb-md">Certifications</h3>
                <div class="row q-gutter-md">
                  <q-card v-for="cert in profile.certifications" :key="cert.name" flat bordered class="cert-card">
                    <q-card-section>
                      <div class="text-weight-bold">{{ cert.name }}</div>
                      <div class="text-sm text-grey-6">{{ cert.provider }} · {{ cert.year }}</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>

            <!-- Gigs -->
            <q-tab-panel name="gigs" class="q-pa-none">
              <div class="gigs-grid">
                <GigCard v-for="gig in gigs" :key="gig.id" :gig="gig" />
              </div>
              <div v-if="!gigs.length" class="empty-tab-state">No gigs yet</div>
            </q-tab-panel>

            <!-- Portfolio -->
            <q-tab-panel name="portfolio" class="q-pa-none">
              <div class="portfolio-grid">
                <q-card v-for="item in portfolio" :key="item.id" class="gg-card portfolio-card">
                  <q-img :src="item.images[0] || 'https://placehold.co/400x240/5B21B6/white?text=Project'" :ratio="16/9" />
                  <q-card-section>
                    <div class="text-weight-bold q-mb-xs">{{ item.projectTitle }}</div>
                    <p class="text-grey-6 text-sm" style="line-height:1.5">{{ item.description }}</p>
                    <div class="row q-gutter-xs q-mt-sm">
                      <q-chip v-for="tech in item.technologies.slice(0,4)" :key="tech" dense color="purple-1" text-color="primary" :label="tech" size="sm" />
                    </div>
                  </q-card-section>
                  <q-card-actions>
                    <q-btn v-if="item.projectUrl" flat no-caps icon="open_in_new" label="View Project" size="sm" color="primary" :href="item.projectUrl" target="_blank" />
                  </q-card-actions>
                </q-card>
              </div>
              <div v-if="!portfolio.length" class="empty-tab-state">No portfolio items yet</div>
            </q-tab-panel>

            <!-- Reviews -->
            <q-tab-panel name="reviews" class="q-pa-none">
              <div v-for="review in reviews" :key="review.id" class="review-item q-mb-lg">
                <div class="row items-start q-gutter-md">
                  <q-avatar size="40px" color="accent" text-color="white">
                    <span>{{ getInitials(review.client?.fullName || '') }}</span>
                  </q-avatar>
                  <div class="col">
                    <div class="row items-center q-gutter-sm">
                      <span class="text-weight-bold">{{ review.client?.fullName }}</span>
                      <StarRating :rating="review.rating" size="13px" />
                      <span class="text-xs text-grey">{{ timeAgo(review.createdAt) }}</span>
                    </div>
                    <p class="text-grey-7 q-mt-xs">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
              <div v-if="!reviews.length" class="empty-tab-state">No reviews yet</div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { userService } from 'src/services/user.service'
  import { gigService } from 'src/services/gig.service'
  import { reviewService } from 'src/services/review.service'
  import { useChatStore } from 'src/stores/chat.store'
  import { useAuthStore } from 'src/stores/auth.store'
  import { getInitials, formatDate, timeAgo } from 'src/utils/helpers'
  import type { FreelancerProfile, Gig, PortfolioItem, Review } from 'src/types'
  import GigCard from 'src/components/common/GigCard.vue'
  import StarRating from 'src/components/common/StarRating.vue'

  const route = useRoute()
  const router = useRouter()
  const chatStore = useChatStore()
  const authStore = useAuthStore()

  const loading = ref(true)
  const profile = ref<FreelancerProfile | null>(null)
  const gigs = ref<Gig[]>([])
  const portfolio = ref<PortfolioItem[]>([])
  const reviews = ref<Review[]>([])
  const tab = ref('about')

  function getLevelColor(level: string) {
    const map: Record<string, string> = { new: 'grey', level_1: 'blue', level_2: 'purple', top_rated: 'orange' }
    return map[level] || 'grey'
  }
  function getLevelLabel(level: string) {
    const map: Record<string, string> = { new: 'New Seller', level_1: 'Level 1', level_2: 'Level 2', top_rated: '⭐ Top Rated' }
    return map[level] || level
  }

  function goHire() {
    tab.value = 'gigs'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function openChat() {
    if (!authStore.isAuthenticated) { router.push('/auth/login'); return }
    await chatStore.openConversation(profile.value!.userId)
    router.push(authStore.isClient ? '/client/messages' : '/freelancer/messages')
  }

  onMounted(async () => {
    const username = route.params.username as string
    try {
      const [profileData, gigsData, portfolioData, reviewsData] = await Promise.all([
        userService.getProfile(username),
        gigService.getGigs({ query: username, limit: 8 }),
        userService.getPortfolio(''),
        reviewService.getFreelancerReviews('')
      ])
      profile.value = profileData
      gigs.value = gigsData.data
      portfolio.value = portfolioData
      reviews.value = reviewsData.data
    } finally {
      loading.value = false
    }
  })
</script>

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;

  .profile-avatar { border: 4px solid $primary; }
  .stat-row { padding: 4px 0; }

  .gigs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: $spacing-lg; @media (max-width: $bp-sm) { grid-template-columns: 1fr; } }
  .portfolio-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: $spacing-lg; @media (max-width: $bp-sm) { grid-template-columns: 1fr; } }

  .portfolio-card { border-radius: $radius-lg !important; overflow: hidden; }
  .cert-card { border-radius: $radius-md !important; }

  .review-item { padding-bottom: $spacing-lg; border-bottom: 1px solid $border-color; .body--dark & { border-bottom-color: $border-color-dark; } &:last-child { border-bottom: none; } }
  .empty-tab-state { text-align: center; padding: $spacing-3xl; color: $text-muted; }
</style>
