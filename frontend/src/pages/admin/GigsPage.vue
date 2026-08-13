<template>
  <q-page class="q-pa-lg admin-page">
    <h1 class="text-h5 text-weight-bold q-mb-xl">Gig Moderation</h1>

    <q-tabs v-model="tab" class="q-mb-lg" active-color="primary" indicator-color="primary" align="left" dense>
      <q-tab name="pending" label="Pending Review">
        <q-badge v-if="pendingGigs.length" color="warning" floating :label="pendingGigs.length" />
      </q-tab>
      <q-tab name="published" label="Published" />
      <q-tab name="rejected" label="Rejected" />
    </q-tabs>

    <q-card class="gg-card">
      <q-table
        :rows="tab === 'pending' ? pendingGigs : tab === 'published' ? publishedGigs : rejectedGigs"
        :columns="columns"
        flat row-key="id"
        :loading="loading"
        :pagination="{ rowsPerPage: 15 }"
      >
        <template #body-cell-title="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-sm">
              <q-img :src="props.row.images?.[0]" style="width:40px;height:30px;border-radius:4px;object-fit:cover" />
              <span class="text-sm" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ props.value }}</span>
            </div>
          </q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="GIG_STATUS_COLORS[props.value]" :label="props.value" />
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <template v-if="props.row.status === 'pending_review'">
              <q-btn flat dense round icon="check_circle" color="positive" size="sm" @click="approveGig(props.row.id)" />
              <q-btn flat dense round icon="cancel" color="negative" size="sm" @click="openRejectDialog(props.row.id)" />
            </template>
            <q-btn flat dense round icon="open_in_new" color="grey" size="sm" :to="`/gigs/${props.row.id}`" />
          </q-td>
        </template>
        <template #no-data>
          <div class="text-center q-pa-xl text-grey-5">No gigs in this category</div>
        </template>
      </q-table>
    </q-card>

    <!-- Reject Dialog -->
    <q-dialog v-model="rejectDialog">
      <q-card style="min-width:380px">
        <q-card-section><div class="text-h6">Reject Gig</div></q-card-section>
        <q-card-section>
          <q-input v-model="rejectReason" type="textarea" outlined dense :rows="3" label="Reason for rejection" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps label="Cancel" v-close-popup />
          <q-btn unelevated no-caps color="negative" label="Reject Gig" :loading="rejecting" @click="rejectGig" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { gigService } from 'src/services/gig.service'
  import { useNotify } from 'src/composables/useNotify'
  import { GIG_STATUS_COLORS } from 'src/utils/constants'
  import type { Gig } from 'src/types'

  const notify = useNotify()
  const tab = ref('pending')
  const loading = ref(true)
  const pendingGigs = ref<Gig[]>([])
  const publishedGigs = ref<Gig[]>([])
  const rejectedGigs = ref<Gig[]>([])
  const rejectDialog = ref(false)
  const rejectReason = ref('')
  const rejectingGigId = ref('')
  const rejecting = ref(false)

  const columns = [
    { name: 'title', label: 'Gig Title', field: 'title', align: 'left' as const },
    { name: 'category', label: 'Category', field: 'category', align: 'left' as const },
    { name: 'freelancer', label: 'Freelancer', field: (r: Gig) => r.freelancer?.user?.fullName || '—', align: 'left' as const },
    { name: 'status', label: 'Status', field: 'status', align: 'left' as const },
    { name: 'createdAt', label: 'Submitted', field: 'createdAt', format: (v: string) => new Date(v).toLocaleDateString(), align: 'left' as const },
    { name: 'actions', label: 'Actions', field: 'id', align: 'right' as const }
  ]

  async function approveGig(id: string) {
    await gigService.approveGig(id)
    pendingGigs.value = pendingGigs.value.filter(g => g.id !== id)
    notify.success('Gig approved!')
  }

  function openRejectDialog(id: string) {
    rejectingGigId.value = id
    rejectReason.value = ''
    rejectDialog.value = true
  }

  async function rejectGig() {
    rejecting.value = true
    try {
      await gigService.rejectGig(rejectingGigId.value, rejectReason.value)
      pendingGigs.value = pendingGigs.value.filter(g => g.id !== rejectingGigId.value)
      rejectDialog.value = false
      notify.success('Gig rejected')
    } finally { rejecting.value = false }
  }

  onMounted(async () => {
    loading.value = true
    const [pendingRes, allRes] = await Promise.all([
      gigService.getPendingGigs(),
      gigService.getGigs({ limit: 100 })
    ])
    pendingGigs.value = pendingRes.data
    publishedGigs.value = allRes.data.filter(g => g.status === 'published')
    rejectedGigs.value = allRes.data.filter(g => g.status === 'rejected')
    loading.value = false
  })
</script>

<style lang="scss" scoped>
  .admin-page { background: #f4f1ff; }
  .body--dark .admin-page { background: #0f0a1e; }
</style>
