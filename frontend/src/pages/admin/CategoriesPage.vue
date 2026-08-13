<template>
  <q-page class="q-pa-lg admin-page">
    <div class="row items-center justify-between q-mb-xl">
      <h1 class="text-h5 text-weight-bold">Category Management</h1>
      <q-btn unelevated no-caps icon="add" label="Add Category" class="btn-primary" @click="openDialog()" />
    </div>

    <q-card class="gg-card">
      <q-table :rows="categories" :columns="columns" flat row-key="id" :loading="loading" :pagination="{ rowsPerPage: 15 }">
        <template #body-cell-icon="props">
          <q-td :props="props"><q-icon :name="props.value" size="20px" color="primary" /></q-td>
        </template>
        <template #body-cell-isActive="props">
          <q-td :props="props"><q-badge :color="props.value ? 'positive' : 'grey'" :label="props.value ? 'Active' : 'Inactive'" /></q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round dense icon="edit" size="sm" color="primary" @click="openDialog(props.row)" />
            <q-btn flat round dense icon="delete" size="sm" color="negative" @click="deleteCategory(props.row.id)" />
          </q-td>
        </template>
        <template #no-data>
          <div class="text-center q-pa-xl text-grey-5">No categories yet</div>
        </template>
      </q-table>
    </q-card>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width:420px;max-width:95vw">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ editing ? 'Edit' : 'Add' }} Category</div>
          <q-space /><q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-gutter-md">
          <div>
            <label class="field-label">Category Name *</label>
            <q-input v-model="form.name" outlined dense placeholder="e.g. Web Development" />
          </div>
          <div>
            <label class="field-label">Icon (Material Icons name)</label>
            <q-input v-model="form.icon" outlined dense placeholder="e.g. code">
              <template #append><q-icon :name="form.icon || 'help'" /></template>
            </q-input>
          </div>
          <div>
            <label class="field-label">Description</label>
            <q-input v-model="form.description" outlined dense type="textarea" :rows="3" />
          </div>
          <q-toggle v-model="form.isActive" label="Active" color="positive" />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat no-caps label="Cancel" v-close-popup />
          <q-btn unelevated no-caps label="Save" class="btn-primary" :loading="saving" @click="saveCategory" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { categoryService } from 'src/services/category.service'
  import { useNotify } from 'src/composables/useNotify'
  import { CATEGORIES } from 'src/utils/constants'
  import type { Category } from 'src/types'

  const notify = useNotify()
  const categories = ref<Category[]>([])
  const loading = ref(true)
  const dialog = ref(false)
  const saving = ref(false)
  const editing = ref<string | null>(null)

  const form = reactive({ name: '', icon: 'category', description: '', isActive: true })

  const columns = [
    { name: 'icon', label: 'Icon', field: 'icon', align: 'center' as const },
    { name: 'name', label: 'Name', field: 'name', align: 'left' as const },
    { name: 'slug', label: 'Slug', field: 'slug', align: 'left' as const },
    { name: 'gigCount', label: 'Gigs', field: 'gigCount', align: 'right' as const },
    { name: 'isActive', label: 'Status', field: 'isActive', align: 'left' as const },
    { name: 'actions', label: 'Actions', field: 'id', align: 'right' as const }
  ]

  function openDialog(cat?: Category) {
    editing.value = cat?.id || null
    if (cat) {
      form.name = cat.name
      form.icon = cat.icon
      form.description = cat.description || ''
      form.isActive = cat.isActive
    } else {
      Object.assign(form, { name: '', icon: 'category', description: '', isActive: true })
    }
    dialog.value = true
  }

  async function saveCategory() {
    saving.value = true
    try {
      if (editing.value) {
        await categoryService.updateCategory(editing.value, form)
      } else {
        await categoryService.createCategory(form)
      }
      notify.success(editing.value ? 'Category updated' : 'Category created')
      dialog.value = false
      await loadCategories()
    } catch { notify.error('Failed to save') }
    finally { saving.value = false }
  }

  async function deleteCategory(id: string) {
    notify.confirmDelete('this category', async () => {
      await categoryService.deleteCategory(id)
      categories.value = categories.value.filter(c => c.id !== id)
      notify.success('Category deleted')
    })
  }

  async function loadCategories() {
    loading.value = true
    try { categories.value = await categoryService.getCategories() }
    catch {
      // Fallback to constants
      categories.value = CATEGORIES.map((c, i) => ({ ...c, gigCount: 0, isActive: true, children: [] }))
    }
    finally { loading.value = false }
  }

  onMounted(loadCategories)
</script>

<style lang="scss" scoped>
  .admin-page { background: #f4f1ff; }
  .body--dark .admin-page { background: #0f0a1e; }
  .field-label { font-size: 0.875rem; font-weight: 500; display: block; margin-bottom: 4px; }
</style>
