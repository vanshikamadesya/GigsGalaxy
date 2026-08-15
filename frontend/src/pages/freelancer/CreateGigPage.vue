<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-xl">
      <q-btn flat round icon="arrow_back" to="/freelancer/gigs" class="q-mr-sm" />
      <div>
        <h1 class="text-h5 text-weight-bold q-mb-xs">Create New Gig</h1>
        <p class="text-grey-6">Fill in the details to publish your service</p>
      </div>
    </div>

    <!-- Step indicator -->
    <q-stepper v-model="step" flat alternative-labels color="primary" class="q-mb-xl">
      <q-step :name="1" title="Overview" icon="info" :done="step > 1" />
      <q-step :name="2" title="Pricing" icon="attach_money" :done="step > 2" />
      <q-step :name="3" title="Gallery" icon="photo_library" :done="step > 3" />
      <q-step :name="4" title="Publish" icon="publish" />
    </q-stepper>

    <div class="create-gig-layout">
      <q-form @submit.prevent class="gig-form">
        <!-- Step 1: Overview -->
        <div v-show="step === 1">
          <q-card class="gg-card q-pa-xl q-mb-lg">
            <div class="form-section-title q-mb-lg">Gig Overview</div>

            <div class="q-gutter-lg">
              <div>
                <label class="field-label">Gig Title *</label>
                <q-input
                  v-model="form.title"
                  outlined dense
                  placeholder="e.g. I will build a professional website using Vue.js"
                  :error="!!errors.title" :error-message="errors.title"
                  counter maxlength="100"
                />
                <div class="text-xs text-grey-5 q-mt-xs">Write a clear, keyword-rich title that describes your service</div>
              </div>

              <div>
                <label class="field-label">Category *</label>
                <q-select
                  v-model="form.category"
                  :options="categoryOptions"
                  outlined dense emit-value map-options
                  :error="!!errors.category" :error-message="errors.category"
                />
              </div>

              <div>
                <label class="field-label">Description *</label>
                <q-input
                  v-model="form.description"
                  type="textarea"
                  outlined :rows="8"
                  placeholder="Describe your service in detail..."
                  :error="!!errors.description" :error-message="errors.description"
                  counter maxlength="5000"
                />
              </div>

              <div>
                <label class="field-label">Tags</label>
                <q-select
                  v-model="form.tags"
                  :options="skillOptions"
                  outlined dense multiple use-chips use-input
                  placeholder="Add relevant tags"
                  :max-values="10"
                />
                <div class="text-xs text-grey-5 q-mt-xs">Add up to 10 tags to help buyers find your gig</div>
              </div>
            </div>
          </q-card>
        </div>

        <!-- Step 2: Pricing -->
        <div v-show="step === 2">
          <q-card class="gg-card q-pa-xl q-mb-lg">
            <div class="form-section-title q-mb-lg">Packages & Pricing</div>

            <q-tabs v-model="pkgTab" dense active-color="primary" indicator-color="primary" class="q-mb-lg">
              <q-tab name="basic" label="Basic" />
              <q-tab name="standard" label="Standard" />
              <q-tab name="premium" label="Premium" />
            </q-tabs>

            <q-tab-panels v-model="pkgTab" animated>
              <q-tab-panel v-for="pkg in form.packages" :key="pkg.name" :name="pkg.name">
                <div class="q-gutter-md">
                  <div class="row q-gutter-md">
                    <div class="col">
                      <label class="field-label">Package Title *</label>
                      <q-input v-model="pkg.title" outlined dense :placeholder="`${pkg.name} package name`" />
                    </div>
                    <div class="col-auto" style="width:140px">
                      <label class="field-label">Price ($) *</label>
                      <q-input v-model.number="pkg.price" type="number" outlined dense prefix="$" min="5" />
                    </div>
                  </div>
                  <div>
                    <label class="field-label">Description</label>
                    <q-input v-model="pkg.description" outlined dense placeholder="What's included..." />
                  </div>
                  <div class="row q-gutter-md">
                    <div class="col">
                      <label class="field-label">Delivery Time (days)</label>
                      <q-input v-model.number="pkg.deliveryTime" type="number" outlined dense min="1" max="90" />
                    </div>
                    <div class="col">
                      <label class="field-label">Revisions</label>
                      <q-input v-model.number="pkg.revisions" type="number" outlined dense min="0" />
                    </div>
                  </div>
                  <div>
                    <label class="field-label">Features (what's included)</label>
                    <div v-for="(feat, i) in pkg.features" :key="i" class="row q-gutter-sm q-mb-sm">
                      <q-input v-model="pkg.features[i]" dense outlined class="col" placeholder="e.g. Responsive design" />
                      <q-btn flat round dense icon="remove" color="negative" @click="pkg.features.splice(i, 1)" />
                    </div>
                    <q-btn flat no-caps size="sm" icon="add" label="Add feature" color="primary" @click="pkg.features.push('')" />
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>

        <!-- Step 3: Gallery -->
        <div v-show="step === 3">
          <q-card class="gg-card q-pa-xl q-mb-lg">
            <div class="form-section-title q-mb-md">Gig Gallery</div>
            <p class="text-grey-6 q-mb-lg">Add images to showcase your service (up to 5 images)</p>

            <div class="upload-zone" @click="imageInput?.click()" @dragover.prevent @drop.prevent="handleDrop">
              <input ref="imageInput" type="file" accept="image/*" multiple style="display:none" @change="handleImageUpload" />
              <q-icon name="cloud_upload" size="48px" color="grey-4" />
              <div class="text-grey-6 q-mt-sm">Drag & drop or click to upload</div>
              <div class="text-xs text-grey-5">PNG, JPG up to 10MB each</div>
            </div>

            <div v-if="imagePreviewUrls.length" class="image-previews row q-gutter-md q-mt-lg">
              <div v-for="(url, i) in imagePreviewUrls" :key="i" class="img-preview-wrap">
                <q-img :src="url" style="width:140px;height:100px;border-radius:8px;object-fit:cover" />
                <q-btn round dense flat icon="close" color="negative" class="img-remove-btn" size="xs" @click="removeImage(i)" />
              </div>
            </div>
          </q-card>
        </div>

        <!-- Step 4: Review & Publish -->
        <div v-show="step === 4">
          <q-card class="gg-card q-pa-xl q-mb-lg">
            <div class="form-section-title q-mb-lg">Review & Publish</div>
            <div class="q-gutter-md">
              <q-banner rounded class="bg-info-1">
                <template #avatar><q-icon name="info" color="info" /></template>
                Your gig will be reviewed by our team before going live. This usually takes 24-48 hours.
              </q-banner>
              <div class="review-row"><span class="text-weight-medium">Title:</span> {{ form.title }}</div>
              <div class="review-row"><span class="text-weight-medium">Category:</span> {{ form.category }}</div>
              <div class="review-row"><span class="text-weight-medium">Basic Price:</span> ${{ form.packages[0].price }}</div>
              <div class="review-row"><span class="text-weight-medium">Tags:</span> {{ form.tags.join(', ') }}</div>
              <div class="review-row"><span class="text-weight-medium">Images:</span> {{ imageFiles.length }} uploaded</div>
            </div>
          </q-card>
        </div>

        <!-- Navigation Buttons -->
        <div class="row justify-between q-mt-md">
          <q-btn flat no-caps label="Back" icon="arrow_back" :disable="step === 1" @click="step--" />
          <div class="row q-gutter-sm">
            <q-btn v-if="step < 4" flat no-caps label="Save Draft" @click="submitGig('draft')" :loading="submitting === 'draft'" />
            <q-btn
              v-if="step < 4"
              unelevated no-caps
              label="Continue"
              icon-right="arrow_forward"
              class="btn-primary"
              @click="nextStep"
            />
            <q-btn
              v-else
              unelevated no-caps
              label="Submit for Review"
              icon="publish"
              class="btn-primary"
              :loading="submitting === 'publish'"
              @click="submitGig('publish')"
            />
          </div>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useGigStore } from 'src/stores/gig.store'
  import { useNotify } from 'src/composables/useNotify'
  import { CATEGORIES, SKILLS_LIST } from 'src/utils/constants'
  import { gigSchema } from 'src/utils/validators'

  const router = useRouter()
  const gigStore = useGigStore()
  const notify = useNotify()

  const step = ref(1)
  const pkgTab = ref('basic')
  const submitting = ref<string | null>(null)
  const imageInput = ref<HTMLInputElement | null>(null)
  const imageFiles = ref<File[]>([])
  const imagePreviewUrls = ref<string[]>([])
  const errors = reactive<Record<string, string>>({})

  const categoryOptions = CATEGORIES.map(c => ({ label: c.name, value: c.slug }))
  const skillOptions = SKILLS_LIST

  const form = reactive({
    title: '',
    category: '',
    description: '',
    tags: [] as string[],
    packages: [
      { name: 'basic' as const, title: 'Basic', description: '', price: 25, deliveryTime: 3, revisions: 1, features: [''] },
      { name: 'standard' as const, title: 'Standard', description: '', price: 75, deliveryTime: 7, revisions: 3, features: [''] },
      { name: 'premium' as const, title: 'Premium', description: '', price: 150, deliveryTime: 14, revisions: 5, features: [''] }
    ]
  })

  async function nextStep() {
    if (step.value === 1) {
      try {
        await gigSchema.validate({ title: form.title, category: form.category, description: form.description, tags: form.tags }, { abortEarly: false })
        Object.keys(errors).forEach(k => delete errors[k])
      } catch (err: unknown) {
        const yupErr = err as { inner?: Array<{ path: string; message: string }> }
        yupErr.inner?.forEach(e => { if (e.path) errors[e.path] = e.message })
        return
      }
    }
    step.value++
  }

  function handleImageUpload(e: Event) {
    const files = Array.from((e.target as HTMLInputElement).files || [])
    files.slice(0, 5 - imageFiles.value.length).forEach(file => {
      imageFiles.value.push(file)
      imagePreviewUrls.value.push(URL.createObjectURL(file))
    })
  }

  function handleDrop(e: DragEvent) {
    const files = Array.from(e.dataTransfer?.files || []).filter(f => f.type.startsWith('image/'))
    files.forEach(file => {
      if (imageFiles.value.length < 5) {
        imageFiles.value.push(file)
        imagePreviewUrls.value.push(URL.createObjectURL(file))
      }
    })
  }

  function removeImage(i: number) {
    URL.revokeObjectURL(imagePreviewUrls.value[i])
    imageFiles.value.splice(i, 1)
    imagePreviewUrls.value.splice(i, 1)
  }

  async function submitGig(mode: 'draft' | 'publish') {
    submitting.value = mode
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('category', form.category)
      fd.append('description', form.description)
      fd.append('tags', JSON.stringify(form.tags))
      fd.append('packages', JSON.stringify(form.packages))
      fd.append('status', mode === 'draft' ? 'draft' : 'pending_review')
      imageFiles.value.forEach(f => fd.append('images', f))

      await gigStore.createGig(fd)
      notify.success(mode === 'draft' ? 'Gig saved as draft' : 'Gig submitted for review!')
      router.push('/freelancer/gigs')
    } catch {
      notify.error('Failed to create gig')
    } finally {
      submitting.value = null
    }
  }
</script>