<template>
  <q-page class="flex flex-center" style="min-height:100vh">
    <div class="text-center q-pa-xl animate-fade-in">
      <div class="error-code">{{ code }}</div>
      <h1 class="text-h4 text-weight-bold q-mb-sm">{{ message }}</h1>
      <p class="text-grey-6 q-mb-xl">
        {{ code === 404 ? "The page you're looking for doesn't exist." : "You don't have permission to access this page." }}
      </p>
      <div class="row justify-center q-gutter-md">
        <q-btn unelevated no-caps to="/" label="Go Home" class="btn-primary q-px-xl" />
        <q-btn flat no-caps label="Go Back" @click="router.back()" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'

  withDefaults(defineProps<{ code?: number; message?: string }>(), {
    code: 404,
    message: 'Page Not Found'
  })

  const router = useRouter()
</script>