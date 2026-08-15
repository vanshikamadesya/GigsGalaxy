<template>
  <q-page class="categories-page">
    <!-- Hero Section -->
    <div class="categories-hero">
      <div class="page-container">
        <div class="hero-content text-center">
          <h1 class="hero-title">Explore Our Categories</h1>
          <p class="hero-subtitle">Browse through our diverse range of professional services</p>
          
          <!-- Search Bar -->
          <div class="category-search-wrap">
            <q-input
              v-model="searchQuery"
              filled
              dense
              placeholder="Search for a category..."
              class="category-search"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
              <template #append v-if="searchQuery">
                <q-icon name="close" class="cursor-pointer" @click="searchQuery = ''" />
              </template>
            </q-input>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="page-container q-py-xl">
      <div class="categories-grid">
        <div
          v-for="cat in filteredCategories"
          :key="cat.id"
          class="category-big-card animate-fade-in"
          :style="{ '--cat-color': getCatColor(cat.slug) }"
          @click="router.push({ name: 'category-detail', params: { slug: cat.slug } })"
        >
          <div class="cat-bg-icon">
            <q-icon :name="cat.icon" size="120px" />
          </div>
          <div class="cat-content">
            <div class="cat-icon-wrap q-mb-md">
              <q-icon :name="cat.icon" size="32px" color="white" />
            </div>
            <div class="cat-name text-white">{{ cat.name }}</div>
            <div class="cat-count text-white opacity-80">500+ services</div>
            <q-icon name="arrow_forward" color="white" size="20px" class="cat-arrow q-mt-sm" />
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="filteredCategories.length === 0" class="text-center q-py-xl">
        <q-icon name="search_off" size="64px" color="grey-5" class="q-mb-md" />
        <div class="text-h6 text-grey-6">No categories found</div>
        <div class="text-grey-5 q-mt-sm">Try searching with different keywords</div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { CATEGORIES } from 'src/utils/constants'

  const router = useRouter()
  const searchQuery = ref('')

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

  const filteredCategories = computed(() => {
    if (!searchQuery.value) return CATEGORIES
    const query = searchQuery.value.toLowerCase()
    return CATEGORIES.filter(cat => 
      cat.name.toLowerCase().includes(query) ||
      cat.slug.toLowerCase().includes(query)
    )
  })

  function getCatColor(slug: string) {
    return catColors[slug] || 'linear-gradient(135deg,#5B21B6,#8B5CF6)'
  }
</script>