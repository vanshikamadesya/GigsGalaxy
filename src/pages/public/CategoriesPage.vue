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

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-lg;
    @media (max-width: $bp-lg)  { grid-template-columns: repeat(3, 1fr); }
    @media (max-width: $bp-md)  { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: $bp-sm)  { grid-template-columns: 1fr; }
  }

  .category-big-card {
    background: var(--cat-color);
    border-radius: $radius-xl;
    padding: $spacing-xl;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    min-height: 160px;
    display: flex;
    align-items: flex-end;
    transition: transform $transition-base, box-shadow $transition-base;

    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-xl;

      .cat-bg-icon { transform: rotate(15deg) scale(1.1); }
    }
  }

  .cat-bg-icon {
    position: absolute;
    top: -10px;
    right: -10px;
    opacity: 0.12;
    transition: transform $transition-slow;
  }

  .cat-content { position: relative; z-index: 1; }

  .cat-icon-wrap {
    width: 56px;
    height: 56px;
    background: rgba(255,255,255,0.15);
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cat-name { font-size: $font-size-lg; font-weight: 700; }
  .cat-count { font-size: $font-size-xs; }
</style>
