<template>
  <q-page class="q-pa-lg admin-page">
    <h1 class="text-h5 text-weight-bold q-mb-xl">Freelancer Management</h1>
    <q-card class="gg-card">
      <q-table :rows="freelancers" :columns="columns" flat row-key="id" :loading="loading" :pagination="{ rowsPerPage: 20 }">
        <template #body-cell-user="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-sm">
              <q-avatar size="32px" color="primary" text-color="white"><span class="text-caption">{{ getInitials(props.row.user?.fullName || '') }}</span></q-avatar>
              <div>
                <div class="text-weight-medium text-sm">{{ props.row.user?.fullName }}</div>
                <div class="text-xs text-grey-5">{{ props.row.user?.email }}</div>
              </div>
            </div>
          </q-td>
        </template>
        <template #body-cell-level="props">
          <q-td :props="props"><q-badge :color="getLevelColor(props.value)" :label="props.value" /></q-td>
        </template>
        <template #body-cell-isVerified="props">
          <q-td :props="props">
            <q-badge :color="props.row.user?.isVerified ? 'positive' : 'warning'" :label="props.row.user?.isVerified ? 'Verified' : 'Pending'" />
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn v-if="!props.row.user?.isVerified" flat dense round icon="verified" size="sm" color="positive" @click="verify(props.row.userId)">
              <q-tooltip>Verify</q-tooltip>
            </q-btn>
            <q-btn flat dense round icon="block" size="sm" color="warning" @click="block(props.row.userId)">
              <q-tooltip>Block</q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template #no-data>
          <div class="text-center q-pa-xl text-grey-5">No freelancers found</div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { userService } from 'src/services/user.service'
  import { useNotify } from 'src/composables/useNotify'
  import { getInitials } from 'src/utils/helpers'
  import type { FreelancerProfile } from 'src/types'

  const notify = useNotify()
  const freelancers = ref<FreelancerProfile[]>([])
  const loading = ref(true)

  const columns = [
    { name: 'user', label: 'Freelancer', field: 'user', align: 'left' as const },
    { name: 'level', label: 'Level', field: 'level', align: 'left' as const },
    { name: 'completedProjects', label: 'Projects', field: 'completedProjects', align: 'right' as const },
    { name: 'averageRating', label: 'Rating', field: 'averageRating', format: (v: number) => v?.toFixed(1) || '—', align: 'right' as const },
    { name: 'isVerified', label: 'Status', field: 'userId', align: 'left' as const },
    { name: 'actions', label: 'Actions', field: 'id', align: 'right' as const }
  ]

  function getLevelColor(level: string) {
    return { new: 'grey', level_1: 'blue', level_2: 'purple', top_rated: 'orange' }[level] || 'grey'
  }

  async function verify(id: string) {
    await userService.verifyFreelancer(id)
    notify.success('Freelancer verified!')
    const fl = freelancers.value.find(f => f.userId === id)
    if (fl?.user) fl.user.isVerified = true
  }

  async function block(id: string) {
    await userService.blockUser(id)
    notify.warning('User blocked')
  }

  onMounted(async () => {
    const res = await userService.getFreelancers({ limit: 100 })
    freelancers.value = res.data
    loading.value = false
  })
</script>

<style lang="scss" scoped>
  .admin-page { background: #f4f1ff; }
  .body--dark .admin-page { background: #0f0a1e; }
</style>
