<template>
  <q-page class="q-pa-lg admin-page">
    <div class="row items-center justify-between q-mb-xl">
      <h1 class="text-h5 text-weight-bold">User Management</h1>
      <q-input v-model="search" dense outlined placeholder="Search users..." style="width:260px" @update:model-value="loadUsers">
        <template #prepend><q-icon name="search" /></template>
      </q-input>
    </div>

    <q-card class="gg-card">
      <q-table
        :rows="users"
        :columns="columns"
        flat row-key="id"
        :loading="loading"
        :pagination="{ rowsPerPage: 20 }"
      >
        <template #body-cell-fullName="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-sm">
              <q-avatar size="32px" :color="props.row.role === 'freelancer' ? 'primary' : 'accent'" text-color="white">
                <span class="text-caption">{{ getInitials(props.value) }}</span>
              </q-avatar>
              <div>
                <div class="text-weight-medium text-sm">{{ props.value }}</div>
                <div class="text-xs text-grey-5">{{ props.row.email }}</div>
              </div>
            </div>
          </q-td>
        </template>
        <template #body-cell-role="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'admin' ? 'warning' : props.value === 'freelancer' ? 'primary' : 'accent'" :label="props.value" />
          </q-td>
        </template>
        <template #body-cell-isEmailVerified="props">
          <q-td :props="props" class="text-center">
            <q-icon :name="props.value ? 'check_circle' : 'cancel'" :color="props.value ? 'positive' : 'grey-4'" size="18px" />
          </q-td>
        </template>
        <template #body-cell-isBlocked="props">
          <q-td :props="props" class="text-center">
            <q-badge :color="props.value ? 'negative' : 'positive'" :label="props.value ? 'Blocked' : 'Active'" />
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round dense icon="more_vert" size="sm">
              <q-menu>
                <q-list dense style="min-width:160px">
                  <q-item clickable v-close-popup @click="viewUser(props.row.id)">
                    <q-item-section avatar><q-icon name="visibility" /></q-item-section>
                    <q-item-section>View Profile</q-item-section>
                  </q-item>
                  <q-item v-if="props.row.role === 'freelancer' && !props.row.isVerified" clickable v-close-popup @click="verifyUser(props.row.id)">
                    <q-item-section avatar><q-icon name="verified" color="positive" /></q-item-section>
                    <q-item-section>Verify Freelancer</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="toggleBlock(props.row)">
                    <q-item-section avatar><q-icon :name="props.row.isBlocked ? 'lock_open' : 'block'" :color="props.row.isBlocked ? 'positive' : 'warning'" /></q-item-section>
                    <q-item-section>{{ props.row.isBlocked ? 'Unblock' : 'Block' }}</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup @click="deleteUser(props.row.id)" class="text-negative">
                    <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
                    <q-item-section class="text-negative">Delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>
        <template #no-data>
          <div class="text-center q-pa-xl text-grey-5">No users found</div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { userService } from 'src/services/user.service'
  import { useNotify } from 'src/composables/useNotify'
  import { getInitials } from 'src/utils/helpers'
  import type { User } from 'src/types'

  const router = useRouter()
  const notify = useNotify()
  const users = ref<User[]>([])
  const loading = ref(true)
  const search = ref('')

  const columns = [
    { name: 'fullName', label: 'User', field: 'fullName', align: 'left' as const },
    { name: 'role', label: 'Role', field: 'role', align: 'left' as const },
    { name: 'country', label: 'Country', field: 'country', align: 'left' as const },
    { name: 'isEmailVerified', label: 'Email Verified', field: 'isEmailVerified', align: 'center' as const },
    { name: 'isBlocked', label: 'Status', field: 'isBlocked', align: 'left' as const },
    { name: 'createdAt', label: 'Joined', field: 'createdAt', format: (v: string) => new Date(v).toLocaleDateString(), align: 'left' as const },
    { name: 'actions', label: '', field: 'id', align: 'right' as const }
  ]

  function viewUser(id: string) {
    // Navigate to user detail or open a dialog
    notify.info(`Opening user profile: ${id}`)
  }

  async function verifyUser(id: string) {
    await userService.verifyFreelancer(id)
    const user = users.value.find(u => u.id === id)
    if (user) user.isVerified = true
    notify.success('Freelancer verified!')
  }

  async function toggleBlock(user: User) {
    if (user.isBlocked) {
      await userService.unblockUser(user.id)
      user.isBlocked = false
      notify.success('User unblocked')
    } else {
      await userService.blockUser(user.id)
      user.isBlocked = true
      notify.warning('User blocked')
    }
  }

  async function deleteUser(id: string) {
    notify.confirmDelete('this user', async () => {
      await userService.deleteUser(id)
      users.value = users.value.filter(u => u.id !== id)
      notify.success('User deleted')
    })
  }

  async function loadUsers() {
    loading.value = true
    try {
      const res = await userService.getAllUsers({ search: search.value })
      users.value = res.data
    } finally { loading.value = false }
  }

  onMounted(loadUsers)
</script>