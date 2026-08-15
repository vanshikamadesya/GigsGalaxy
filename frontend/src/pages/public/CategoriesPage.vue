<template>
  <q-page class="q-py-xl">
    <div class="page-container">
      <div class="text-center q-mb-3xl">
        <h1 class="text-h4 text-weight-bold q-mb-sm">Browse All Categories</h1>
        <p class="text-grey-6">Find the perfect service for your needs</p>
      </div>

      <div class="categories-grid">
        <div
          v-for="cat in CATEGORIES"
          :key="cat.id"
          class="category-big-card"
          :style="{ '--cat-color': getCatColor(cat.slug) }"
          @click="router.push({ name: 'category-detail', params: { slug: cat.slug } })"
        >
          <div class="cat-bg-icon">
            <q-icon :name="cat.icon" size="80px" />
          </div>
          <div class="cat-content">
            <div class="cat-icon-wrap q-mb-md">
              <q-icon :name="cat.icon" size="36px" color="white" />
            </div>
            <div class="cat-name text-white">{{ cat.name }}</div>
            <div class="cat-count text-white opacity-70">500+ services</div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { CATEGORIES } from 'src/utils/constants'

  const router = useRouter()

  const catColors: Record<string, string> = {
    'web-development': 'linear-gradient(135deg,#5B21B6,#8B5CF6)',
    'mobile-development': 'linear-gradient(135deg,#0369a1,#0ea5e9)',
    'ui-ux-design': 'linear-gradient(135deg,#be185d,#ec4899)',
    'graphic-design': 'linear-gradient(135deg,#b45309,#f59e0b)',
    'video-editing': 'linear-gradient(135deg,#b91c1c,#ef4444)',
    'digital-marketing': 'linear-gradient(135deg,#15803d,#22c55e)',
    'content-writing': 'linear-gradient(135deg,#6d28d9,#a78bfa)',
    'data-science': 'linear-gradient(135deg,#0f766e,#14b8a6)'
  }

  function getCatColor(slug: string) {
    return catColors[slug] || 'linear-gradient(135deg,#5B21B6,#8B5CF6)'
  }
</script>