<template>
  <q-page>
    <!-- ═══ HERO BANNER ═══ -->
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
              borderless
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

    <!-- ═══ TRUSTED BY ═══ -->
    <section class="trusted-section">
      <div class="page-container">
        <p class="trusted-label">Trusted by leading companies</p>
        <div class="trusted-logos row items-center justify-center q-gutter-xl">
          <div v-for="brand in brands" :key="brand" class="brand-logo">{{ brand }}</div>
        </div>
      </div>
    </section>

    <!-- ═══ POPULAR CATEGORIES ═══ -->
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

    <!-- ═══ FEATURED GIGS ═══ -->
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

    <!-- ═══ TOP FREELANCERS ═══ -->
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

    <!-- ═══ HOW IT WORKS ═══ -->
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

    <!-- ═══ TESTIMONIALS ═══ -->
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

    <!-- ═══ CTA BANNER ═══ -->
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

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;

  // ── Hero ──
  .hero-section {
    position: relative;
    min-height: 620px;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 80px 0 60px;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background: $gradient-hero;
  }

  .hero-gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.3) 0%, transparent 60%);
  }

  .particle {
    position: absolute;
    background: rgba(255,255,255,0.15);
    border-radius: 50%;
    animation: particle-float linear infinite;
  }

  @keyframes particle-float {
    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
  }

  .hero-content { position: relative; z-index: 1; }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: $radius-full;
    padding: 6px 16px;
    color: white;
    font-size: $font-size-xs;
    font-weight: 500;
    backdrop-filter: blur(8px);
  }

  .hero-title {
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    font-weight: 800;
    color: white;
    line-height: 1.15;
    margin: 0 0 $spacing-lg;
    letter-spacing: -1px;
  }

  .hero-subtitle {
    font-size: $font-size-lg;
    color: rgba(255,255,255,0.75);
    max-width: 620px;
    line-height: 1.7;
    margin-bottom: $spacing-xl;
  }

  .hero-search {
    max-width: 620px;
    :deep(.q-field__control) {
      background: white !important;
      border-radius: 50px !important;
      height: 64px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15) !important;
      padding: 0 8px 0 24px !important;
      @media (max-width: 600px) {
        height: 54px;
        padding: 0 6px 0 16px !important;
      }
    }
    :deep(.q-field__prepend) { 
      padding-right: 12px;
      @media (max-width: 600px) { padding-right: 8px; }
    }
    :deep(.q-field__append) { padding-left: 0; }
    :deep(.q-field__native) { 
      font-size: 1.1rem; 
      @media (max-width: 600px) { font-size: 0.95rem; }
    }
  }

  .hero-search-btn {
    border-radius: 50px !important;
    padding: 0 32px !important;
    height: 48px;
    font-size: 1rem;
    font-weight: 600;
    @media (max-width: 600px) {
      padding: 0 20px !important;
      height: 42px;
      font-size: 0.9rem;
    }
  }

  .hero-tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .popular-label {
    color: rgba(255,255,255,0.6);
    font-size: $font-size-xs;
    font-weight: 500;
  }

  .hero-tag {
    background: rgba(255,255,255,0.1) !important;
    color: rgba(255,255,255,0.85) !important;
    border: 1px solid rgba(255,255,255,0.2) !important;
    border-radius: $radius-full !important;
    font-size: $font-size-xs !important;
    transition: all $transition-fast;
    &:hover { background: rgba(255,255,255,0.2) !important; }
  }

  .hero-stat-value { font-size: $font-size-2xl; font-weight: 800; color: white; }
  .hero-stat-label { font-size: $font-size-xs; color: rgba(255,255,255,0.6); }

  // ── Trusted ──
  .trusted-section {
    background: white;
    padding: $spacing-xl 0;
    border-bottom: 1px solid $border-color;
    .body--dark & { background: $surface-dark; border-bottom-color: $border-color-dark; }
  }
  .trusted-label { text-align: center; font-size: $font-size-xs; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: $text-muted; margin-bottom: $spacing-md; }
  .brand-logo { font-size: $font-size-lg; font-weight: 700; color: $text-muted; opacity: 0.5; }

  // ── Sections ──
  .bg-section { background: $bg-light; .body--dark & { background: #0f0f1a; } }

  .section-eyebrow {
    font-size: $font-size-xs;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: $primary;
    margin-bottom: 4px;
  }

  // ── Categories ──
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-md;

    @media (max-width: $bp-lg)  { grid-template-columns: repeat(3, 1fr); }
    @media (max-width: $bp-md)  { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: $bp-sm)  { grid-template-columns: 1fr 1fr; }
  }

  .category-card {
    background: white;
    border: 1px solid $border-color;
    border-radius: $radius-lg;
    padding: $spacing-lg;
    cursor: pointer;
    transition: all $transition-base;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--cat-color);
      transform: scaleX(0);
      transition: transform $transition-base;
    }

    &:hover {
      border-color: var(--cat-color);
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      transform: translateY(-2px);
      &::before { transform: scaleX(1); }
      .cat-icon-wrap { background: var(--cat-color); .q-icon { color: white !important; } }
    }

    .body--dark & { background: $surface-dark; border-color: $border-color-dark; }
  }

  .cat-icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: $radius-md;
    background: rgba(91,33,182,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: $spacing-md;
    transition: background $transition-base;

    .q-icon { color: var(--cat-color) !important; transition: color $transition-base; }
  }

  .cat-name { font-weight: 600; font-size: $font-size-sm; margin-bottom: 4px; }
  .cat-arrow { color: $text-muted; }

  // ── Gigs / Freelancers grids ──
  .gigs-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-lg;

    @media (max-width: $bp-xl)  { grid-template-columns: repeat(3, 1fr); }
    @media (max-width: $bp-md)  { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: $bp-sm)  { grid-template-columns: 1fr; }
  }

  .freelancers-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-lg;

    @media (max-width: $bp-xl)  { grid-template-columns: repeat(3, 1fr); }
    @media (max-width: $bp-md)  { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: $bp-sm)  { grid-template-columns: 1fr; }
  }

  // ── How it works ──
  .how-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-xl;
    @media (max-width: $bp-md) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: $bp-sm) { grid-template-columns: 1fr; }
  }

  .how-step { padding: $spacing-lg; position: relative; }
  .how-step-num {
    position: absolute;
    top: 0;
    right: $spacing-lg;
    font-size: 5rem;
    font-weight: 900;
    color: rgba(91,33,182,0.06);
    line-height: 1;
  }
  .how-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba(91,33,182,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto $spacing-md;
  }
  .how-title { font-size: $font-size-lg; font-weight: 700; margin-bottom: $spacing-sm; }
  .how-desc  { font-size: $font-size-sm; color: $text-muted; line-height: 1.6; }

  // ── Testimonials ──
  .testimonials-carousel {
    height: auto !important;
    border-radius: $radius-xl !important;
    background: transparent !important;
  }

  .testimonial-card {
    background: white;
    border-radius: $radius-xl;
    padding: $spacing-2xl;
    max-width: 700px;
    margin: 0 auto;
    box-shadow: $shadow-lg;
    .body--dark & { background: $surface-dark; }
  }

  .testimonial-text {
    font-size: $font-size-lg;
    line-height: 1.7;
    color: $text-secondary;
    font-style: italic;
  }

  // ── CTA ──
  .cta-section { background: $gradient-primary; padding: $spacing-3xl 0; }
  .cta-title { font-size: $font-size-4xl; font-weight: 800; margin-bottom: $spacing-sm; }
  .cta-subtitle { font-size: $font-size-lg; }
  .cta-btn { border-radius: $radius-md !important; padding: 12px 32px !important; font-weight: 600 !important; }
</style>
