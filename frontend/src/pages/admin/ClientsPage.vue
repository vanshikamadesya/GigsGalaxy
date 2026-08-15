<template>
  <q-page class="q-pa-lg admin-page">
    <h1 class="text-h5 text-weight-bold q-mb-xl">Client Management</h1>
    <q-card class="gg-card">
      <q-table :rows="clients" :columns="columns" flat row-key="id" :loading="loading" :pagination="{ rowsPerPage: 20 }">
        <template #body-cell-isBlocked="props">
          <q-td :props="props">
            <q-badge :color="props.value ? 'negative' : 'positive'" :label="props.value ? 'Blocked' : 'Active'" />
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense round :icon="props.row.isBlocked ? 'lock_open' : 'block'" :color="props.row.isBlocked ? 'positive' : 'warning'" size="sm" @click="toggleBlock(props.row)" />
            <q-btn flat dense round icon="delete" color="negative" size="sm" @click="del(props.row.id)" />
          </q-td>
        </template>
        <template #no-data><div class="text-center q-pa-xl text-grey-5">No clients found</div></template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { userService } from 'src/services/user.service'
  import { useNotify } from 'src/composables/useNotify'
  import type { User } from 'src/types'

  const notify = useNotify()
  const clients = ref<User[]>([])
  const loading = ref(true)

  const columns = [
    { name: 'fullName', label: 'Name', field: 'fullName', align: 'left' as const },
    { name: 'email', label: 'Email', field: 'email', align: 'left' as const },
    { name: 'country', label: 'Country', field: 'country', align: 'left' as const },
    { name: 'isBlocked', label: 'Status', field: 'isBlocked', align: 'left' as const },
    { name: 'createdAt', label: 'Joined', field: 'createdAt', format: (v: string) => new Date(v).toLocaleDateString(), align: 'left' as const },
    { name: 'actions', label: 'Actions', field: 'id', align: 'right' as const }
  ]

  async function toggleBlock(user: User) {
    if (user.isBlocked) { await userService.unblockUser(user.id); user.isBlocked = false; notify.success('Unblocked') }
    else { await userService.blockUser(user.id); user.isBlocked = true; notify.warning('Blocked') }
  }

  async function del(id: string) {
    notify.confirmDelete('this client', async () => {
      await userService.deleteUser(id)
      clients.value = clients.value.filter(u => u.id !== id)
    })
  }

  onMounted(async () => {
    const res = await userService.getAllUsers({ role: 'client', limit: 100 })
    clients.value = res.data
    loading.value = false
  })
</script>