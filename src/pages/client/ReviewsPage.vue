<template>
  <q-page class="q-pa-lg">
    <h1 class="text-h5 text-weight-bold q-mb-xl">My Reviews</h1>
    <q-card class="gg-card">
      <q-table :rows="reviews" :columns="columns" flat row-key="id" :loading="loading" :pagination="{ rowsPerPage: 15 }">
        <template #body-cell-rating="props">
          <q-td :props="props"><StarRating :rating="props.value" size="14px" /></q-td>
        </template>
        <template #no-data>
          <div class="full-width text-center q-pa-xl text-grey-5">
            <q-icon name="star_border" size="48px" class="q-mb-md" />
            <div>No reviews given yet</div>
          </div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { reviewService } from 'src/services/review.service'
  import type { Review } from 'src/types'
  import StarRating from 'src/components/common/StarRating.vue'

  const reviews = ref<Review[]>([])
  const loading = ref(true)

  const columns = [
    { name: 'gig', label: 'Gig', field: (r: Review) => r.gig?.title || '—', align: 'left' as const },
    { name: 'rating', label: 'Rating', field: 'rating', align: 'left' as const },
    { name: 'comment', label: 'Comment', field: 'comment', align: 'left' as const },
    { name: 'createdAt', label: 'Date', field: 'createdAt', format: (v: string) => new Date(v).toLocaleDateString(), align: 'left' as const }
  ]

  onMounted(async () => {
    reviews.value = await reviewService.getMyReviews()
    loading.value = false
  })
</script>
