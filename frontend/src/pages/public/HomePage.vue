<template>
  <q-page>
    <!-- â•â•â• HERO BANNER â•â•â• -->
    <section class="hero-section">
      <div class="hero-bg">
        <div class="hero-gradient" />
        <div class="hero-particles" aria-hidden="true">
          <span v-for="i in 20" :key="i" class="particle" :style="particleStyle(i)" />
        </div>
      </div>
      <div class="page-container hero-content">
        <div class="hero-text animate-fade-in">
          <div class="hero-badge q-mb-md">
            <q-icon name="auto_awesome" size="14px" color="warning" />
            Trusted by 50,000+ businesses worldwide
          </div>
          <h1 class="hero-title">
            Find the <span class="text-gradient">perfect talent</span><br />
            for every project
          </h1>
          <p class="hero-subtitle">
            Connect with top-rated freelancers across 100+ categories. Get professional work done fast, affordably, and with quality guaranteed.
          </p>

          <!-- Search bar -->
          <div class="hero-search q-mt-lg q-mb-xl">
            <q-input
              v-model="searchQuery"
              placeholder='Try "web development", "logo design", "SEO"...'
              class="hero-search-input"
              @keyup.enter="doSearch"
            >
              <template #prepend>
                <q-icon name="search" size="24px" color="grey-6" />
              </template>
              <template #append>
                <q-btn unelevated no-caps label="Search" class="hero-search-btn bg-primary text-white" @click="doSearch" />
              </template>
            </q-input>
          </div>

          <!-- Popular searches -->
          <div class="hero-tags q-mt-md">
            <span class="popular-label">Popular:</span>
            <q-chip
              v-for="tag in popularTags"
              :key="tag"
              dense clickable
              class="hero-tag"
              @click="quickSearch(tag)"
            >
              {{ tag }}
            </q-chip>
          </div>
        </div>

        <div class="hero-stats row q-gutter-lg q-mt-3xl gt-sm">
          <div v-for="stat in heroStats" :key="stat.label" class="hero-stat">
            <div class="hero-stat-value">{{ stat.value }}</div>
            <div class="hero-stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- â•â•â• TRUSTED BY â•â•â• -->
    <section class="trusted-section">
      <div class="page-container">
        <p class="trusted-label">Trusted by leading companies</p>
        <div class="trusted-logos row items-center justify-center q-gutter-xl">
          <div v-for="brand in brands" :key="brand" class="brand-logo">{{ brand }}</div>
        </div>
      </div>
    </section>

    <!-- â•â•â• POPULAR CATEGORIES â•â•â• -->
    <section class="section">
      <div class="page-container">
        <div class="section-header row justify-between items-center q-mb-xl">
          <div class="q-mb-md-none q-mb-sm-sm">
            <div class="section-eyebrow">Browse by</div>
            <h2 class="section-title q-mb-none">Popular Categories</h2>
          </div>
          <q-btn flat no-caps to="/categories" label="View all categories" icon-right="chevron_right" color="primary" />
        </div>

        <div class="categories-grid">
          <div
            v-for="cat in CATEGORIES"
            :key="cat.id"
            class="category-card"
            :style="{ '--cat-color': categoryColors[cat.slug] || '#5B21B6' }"
            @click="goToCategory(cat.slug)"
          >
            <div class="cat-icon-wrap">
              <q-icon :name="cat.icon" size="32px" />
            </div>
            <div class="cat-name">{{ cat.name }}</div>
            <div class="cat-arrow">
              <q-icon name="arrow_forward" size="16px" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- â•â•â• FEATURED GIGS â•â•â• -->
    <section class="section bg-section">
      <div class="page-container">
        <div class="section-header row items-end justify-between q-mb-xl">
          <div>
            <div class="section-eyebrow">Hand-picked</div>
            <h2 class="section-title">Featured Gigs</h2>
          </div>
          <q-btn flat no-caps to="/gigs" label="Browse all gigs" icon-right="chevron_right" color="primary" />
        </div>

        <!-- Skeleton loaders -->
        <div v-if="gigsLoading" class="gigs-grid">
          <q-card v-for="i in 4" :key="i" class="gg-card">
            <div class="skeleton" style="height:180px;border-radius:12px 12px 0 0" />
            <q-card-section>
              <div class="skeleton q-mb-sm" style="height:14px;width:80%;border-radius:4px" />
              <div class="skeleton" style="height:12px;width:60%;border-radius:4px" />
            </q-card-section>
          </q-card>
        </div>

        <div v-else class="gigs-grid">
          <GigCard v-for="gig in gigStore.featuredGigs" :key="gig.id" :gig="gig" />
        </div>
      </div>
    </section>

    <!-- â•â•â• TOP FREELANCERS â•â•â• -->
    <section class="section">
      <div class="page-container">
        <div class="section-header row items-end justify-between q-mb-xl">
          <div>
            <div class="section-eyebrow">Top Talent</div>
            <h2 class="section-title">Top Rated Freelancers</h2>
          </div>
          <q-btn flat no-caps to="/freelancers" label="View all freelancers" icon-right="chevron_right" color="primary" />
        </div>

        <div class="freelancers-grid">
          <FreelancerCard
            v-for="fl in topFreelancers"
            :key="fl.id"
            :profile="fl"
            :online-users="chatStore.onlineUsers"
          />
        </div>
      </div>
    </section>

    <!-- â•â•â• HOW IT WORKS â•â•â• -->
    <section id="how-it-works" class="section bg-section">
      <div class="page-container text-center">
        <div class="section-eyebrow">Simple process</div>
        <h2 class="section-title q-mb-xl">How GigGalaxy Works</h2>

        <div class="how-grid">
          <div v-for="(step, idx) in howSteps" :key="idx" class="how-step">
            <div class="how-step-num">{{ idx + 1 }}</div>
            <div class="how-icon">
              <q-icon :name="step.icon" size="36px" color="primary" />
            </div>
            <h3 class="how-title">{{ step.title }}</h3>
            <p class="how-desc">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- â•â•â• TESTIMONIALS â•â•â• -->
    <section class="section">
      <div class="page-container">
        <div class="text-center q-mb-xl">
          <div class="section-eyebrow">Success stories</div>
          <h2 class="section-title">What Our Users Say</h2>
        </div>

        <q-carousel
          v-model="testimonialSlide"
          animated swipeable infinite
          :autoplay="5000"
          transition-prev="slide-right"
          transition-next="slide-left"
          class="testimonials-carousel"
          control-color="primary"
          arrows indicators
        >
          <q-carousel-slide
            v-for="(t, idx) in testimonials"
            :key="idx"
            :name="idx"
          >
            <div class="testimonial-card">
              <q-icon name="format_quote" size="48px" color="primary" class="opacity-20" />
              <p class="testimonial-text">{{ t.text }}</p>
              <div class="testimonial-author row items-center q-gutter-md q-mt-lg">
                <q-avatar size="48px" color="primary" text-color="white">{{ t.initials }}</q-avatar>
                <div>
                  <div class="text-weight-bold">{{ t.name }}</div>
                  <div class="text-grey-6 text-sm">{{ t.role }}</div>
                </div>
                <q-space />
                <StarRating :rating="5" size="16px" />
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </section>

    <!-- â•â•â• CTA BANNER â•â•â• -->
    <section class="cta-section">
      <div class="page-container cta-content text-center">
        <h2 class="cta-title text-white">Ready to get started?</h2>
        <p class="cta-subtitle text-white opacity-80">
          Join over 50,000 freelancers and clients on GigGalaxy today.
        </p>
        <div class="row justify-center q-gutter-md q-mt-xl">
          <q-btn unelevated no-caps to="/auth/register" label="Find Talent" size="lg" color="white" text-color="primary" class="cta-btn" />
          <q-btn outline no-caps to="/auth/register?role=freelancer" label="Start Selling" size="lg" color="white" class="cta-btn" />
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useGigStore } from 'src/stores/gig.store'
  import { useChatStore } from 'src/stores/chat.store'
  import { userService } from 'src/services/user.service'
  import { CATEGORIES } from 'src/utils/constants'
  import type { FreelancerProfile } from 'src/types'
  import GigCard from 'src/components/common/GigCard.vue'
  import FreelancerCard from 'src/components/common/FreelancerCard.vue'
  import StarRating from 'src/components/common/StarRating.vue'

  const router = useRouter()
  const gigStore = useGigStore()
  const chatStore = useChatStore()

  const searchQuery = ref('')
  const testimonialSlide = ref(0)
  const gigsLoading = ref(true)
  const topFreelancers = ref<FreelancerProfile[]>([])

  const popularTags = ['Website Design', 'Logo Design', 'SEO', 'Mobile App', 'WordPress', 'Video Editing']

  const heroStats = [
    { value: '50K+', label: 'Freelancers' },
    { value: '200K+', label: 'Projects Done' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '150+', label: 'Countries' }
  ]

  const brands = ['Google', 'Microsoft', 'Airbnb', 'Spotify', 'Shopify', 'HubSpot']

  const categoryColors: Record<string, string> = {
    'web-development': '#5B21B6',
    'mobile-development': '#0891b2',
    'ui-ux-design': '#ec4899',
    'graphic-design': '#f59e0b',
    'video-editing': '#ef4444',
    'digital-marketing': '#22c55e',
    'content-writing': '#8b5cf6',
    'data-science': '#14b8a6'
  }

  const howSteps = [
    { icon: 'search',          title: 'Post a Project',    desc: 'Describe what you need and set your budget in minutes.' },
    { icon: 'people',          title: 'Browse Talent',     desc: 'Review profiles, portfolios, and ratings to find the perfect match.' },
    { icon: 'handshake',       title: 'Hire & Collaborate', desc: 'Work together in real-time with built-in chat and file sharing.' },
    { icon: 'verified',        title: 'Pay Securely',      desc: 'Funds held in escrow, released only when you approve the work.' }
  ]

  const testimonials = [
    { text: 'GigGalaxy transformed how we find talent. We hired a full-stack developer in 48 hours and the quality exceeded our expectations.', name: 'Sarah Johnson', role: 'CTO at TechFlow', initials: 'SJ' },
    { text: 'As a freelance designer, I have tripled my income since joining. The platform is easy to use and payments are always on time.', name: 'Marcus Chen', role: 'UI/UX Designer', initials: 'MC' },
    { text: 'The escrow system gives us peace of mind. We always know our money is protected until the job is done right.', name: 'Priya Sharma', role: 'Founder at GrowthLab', initials: 'PS' }
  ]

  function particleStyle(i: number) {
    return {
      left: `${(i * 13) % 100}%`,
      top: `${(i * 17) % 100}%`,
      width: `${2 + (i % 4)}px`,
      height: `${2 + (i % 4)}px`,
      animationDelay: `${i * 0.3}s`,
      animationDuration: `${4 + (i % 6)}s`
    }
  }

  function doSearch() {
    if (searchQuery.value.trim()) router.push({ name: 'search', query: { q: searchQuery.value } })
  }

  function quickSearch(tag: string) {
    router.push({ name: 'search', query: { q: tag } })
  }

  function goToCategory(slug: string) {
    router.push({ name: 'category-detail', params: { slug } })
  }

  onMounted(async () => {
    await gigStore.fetchFeaturedGigs()
    gigsLoading.value = false
    try {
      topFreelancers.value = await userService.getTopRatedFreelancers()
    } catch { /* use empty */ }
  })
</script>

