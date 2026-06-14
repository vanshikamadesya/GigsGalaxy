<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h1 class="text-h5 text-weight-bold q-mb-xs">Portfolio</h1>
        <p class="text-grey-6">Showcase your best work to attract clients</p>
      </div>
      <q-btn unelevated no-caps class="btn-primary" icon="add" label="Add Project" @click="openDialog()" />
    </div>

    <div v-if="loading" class="portfolio-grid">
      <q-card v-for="i in 6" :key="i" class="gg-card"><div class="skeleton" style="height:180px" /><q-card-section><div class="skeleton" style="height:14px;width:80%" /></q-card-section></q-card>
    </div>

    <div v-else-if="items.length" class="portfolio-grid">
      <q-card v-for="item in items" :key="item.id" class="gg-card portfolio-card">
        <q-img :src="item.images[0] || 'https://placehold.co/400x240/5B21B6/white?text=Project'" :ratio="16/9" />
        <q-card-section>
          <div class="text-weight-bold q-mb-xs">{{ item.projectTitle }}</div>
          <p class="text-grey-6 text-sm ellipsis-2-lines">{{ item.description }}</p>
          <div class="row q-gutter-xs q-mt-sm">
            <q-chip v-for="tech in item.technologies.slice(0, 3)" :key="tech" dense color="purple-1" text-color="primary" :label="tech" size="sm" />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <q-btn flat no-caps size="sm" icon="edit" label="Edit" @click="openDialog(item)" />
          <q-btn flat no-caps size="sm" icon="delete" color="negative" @click="deleteItem(item.id)" />
          <q-space />
          <q-btn v-if="item.projectUrl" flat no-caps size="sm" icon="open_in_new" label="View" :href="item.projectUrl" target="_blank" />
        </q-card-actions>
      </q-card>
    </div>

    <div v-else class="text-center q-py-3xl text-grey-5">
      <q-icon name="collections" size="72px" class="q-mb-lg" />
      <h3>No portfolio items yet</h3>
      <p class="q-mb-lg">Add your best projects to impress potential clients</p>
      <q-btn unelevated no-caps class="btn-primary" label="Add First Project" @click="openDialog()" />
    </div>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width:520px;max-width:95vw">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ editing ? 'Edit' : 'Add' }} Portfolio Item</div>
          <q-space /><q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-gutter-md">
          <div>
            <label class="field-label">Project Title *</label>
            <q-input v-model="form.projectTitle" outlined dense placeholder="e.g. E-commerce website for XYZ brand" />
          </div>
          <div>
            <label class="field-label">Description *</label>
            <q-input v-model="form.description" outlined dense type="textarea" :rows="4" placeholder="Describe the project, your role, and the outcome..." />
          </div>
          <div>
            <label class="field-label">Project URL</label>
            <q-input v-model="form.projectUrl" outlined dense placeholder="https://..." />
          </div>
          <div>
            <label class="field-label">Technologies Used</label>
            <q-select v-model="form.technologies" :options="SKILLS_LIST" outlined dense multiple use-chips use-input />
          </div>
          <div>
            <label class="field-label">Images</label>
            <q-file v-model="portfolioFiles" outlined dense multiple label="Upload images" accept="image/*" />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat no-caps label="Cancel" v-close-popup />
          <q-btn unelevated no-caps label="Save" class="btn-primary" :loading="saving" @click="saveItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { userService } from 'src/services/user.service'
  import { useAuthStore } from 'src/stores/auth.store'
  import { useNotify } from 'src/composables/useNotify'
  import { SKILLS_LIST } from 'src/utils/constants'
  import type { PortfolioItem } from 'src/types'

  const authStore = useAuthStore()
  const notify = useNotify()

  const items = ref<PortfolioItem[]>([])
  const loading = ref(true)
  const dialog = ref(false)
  const saving = ref(false)
  const editing = ref<string | null>(null)
  const portfolioFiles = ref<File[]>([])

  const form = reactive({ projectTitle: '', description: '', projectUrl: '', technologies: [] as string[] })

  function openDialog(item?: PortfolioItem) {
    editing.value = item?.id || null
    if (item) {
      form.projectTitle = item.projectTitle
      form.description = item.description
      form.projectUrl = item.projectUrl || ''
      form.technologies = [...item.technologies]
    } else {
      Object.assign(form, { projectTitle: '', description: '', projectUrl: '', technologies: [] })
    }
    dialog.value = true
  }

  async function saveItem() {
    saving.value = true
    try {
      const fd = new FormData()
      fd.append('projectTitle', form.projectTitle)
      fd.append('description', form.description)
      fd.append('projectUrl', form.projectUrl)
      fd.append('technologies', JSON.stringify(form.technologies))
      portfolioFiles.value.forEach(f => fd.append('images', f))

      if (editing.value) {
        await userService.updatePortfolioItem(editing.value, fd)
        notify.success('Portfolio item updated')
      } else {
        await userService.addPortfolioItem(fd)
        notify.success('Portfolio item added')
      }
      dialog.value = false
      await loadItems()
    } catch { notify.error('Failed to save') }
    finally { saving.value = false }
  }

  async function deleteItem(id: string) {
    notify.confirmDelete('this project', async () => {
      await userService.deletePortfolioItem(id)
      items.value = items.value.filter(i => i.id !== id)
      notify.success('Deleted')
    })
  }

  async function loadItems() {
    loading.value = true
    try { items.value = await userService.getPortfolio(authStore.user?.id || '') }
    finally { loading.value = false }
  }

  onMounted(loadItems)
</script>

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;
  .portfolio-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: $spacing-lg; @media (max-width: $bp-lg) { grid-template-columns: repeat(2, 1fr); } @media (max-width: $bp-sm) { grid-template-columns: 1fr; } }
  .portfolio-card { border-radius: $radius-lg !important; overflow: hidden; }
  .ellipsis-2-lines { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .field-label { font-size: $font-size-sm; font-weight: 500; color: $text-secondary; display: block; margin-bottom: 4px; }
</style>
