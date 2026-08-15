<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-xl">
      <q-btn flat round icon="arrow_back" to="/freelancer/orders" class="q-mr-sm" />
      <h1 class="text-h5 text-weight-bold">Order Details</h1>
      <q-space />
      <q-badge v-if="order" :color="ORDER_STATUS_COLORS[order.status]" :label="ORDER_STATUS_LABELS[order.status]" class="text-sm q-pa-sm" />
    </div>

    <div v-if="orderStore.loading" class="row q-gutter-xl">
      <div class="col skeleton" style="height:400px;border-radius:16px" />
      <div class="col-4 skeleton" style="height:300px;border-radius:16px" />
    </div>

    <div v-else-if="order" class="row q-col-gutter-xl">
      <div class="col-12 col-md-8">
        <!-- Order Status Stepper -->
        <q-card class="gg-card q-pa-lg q-mb-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Order Progress</div>
          <OrderStatusStepper :status="order.status" />
        </q-card>

        <!-- Gig Info -->
        <q-card class="gg-card q-pa-lg q-mb-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Gig Details</div>
          <div class="row items-center q-gutter-md">
            <q-img :src="order.gig?.images?.[0]" style="width:80px;height:60px;border-radius:8px" />
            <div>
              <div class="text-weight-bold">{{ order.gig?.title }}</div>
              <div class="text-sm text-grey-6 capitalize">{{ order.packageType }} Package · ${{ order.price }}</div>
              <div class="text-sm text-grey-6">{{ order.deliveryTime }} days delivery · {{ order.revisions }} revisions</div>
            </div>
          </div>
        </q-card>

        <!-- Requirements -->
        <q-card class="gg-card q-pa-lg q-mb-lg" v-if="order.requirements?.length">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Client Requirements</div>
          <div v-for="req in order.requirements" :key="req.question" class="requirement-item q-mb-sm">
            <div class="text-weight-medium text-sm">{{ req.question }}</div>
            <div class="text-grey-7 q-mt-xs">{{ req.answer }}</div>
          </div>
        </q-card>

        <!-- Deliverables -->
        <q-card class="gg-card q-pa-lg q-mb-lg">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold">Deliverables</div>
            <q-btn v-if="order.status === 'in_progress'" unelevated no-caps class="btn-primary" icon="upload" label="Upload Delivery" @click="deliverDialog = true" />
          </div>
          <div v-if="order.deliverables?.length">
            <q-item v-for="d in order.deliverables" :key="d.id" dense>
              <q-item-section avatar><q-icon name="attach_file" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label>{{ d.fileName }}</q-item-label>
                <q-item-label caption>{{ new Date(d.uploadedAt).toLocaleString() }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat round dense icon="download" :href="d.fileUrl" target="_blank" />
              </q-item-section>
            </q-item>
          </div>
          <div v-else class="text-grey-5 text-sm">No deliverables uploaded yet</div>
        </q-card>
      </div>

      <!-- Sidebar -->
      <div class="col-12 col-md-4">
        <!-- Client info -->
        <q-card class="gg-card q-pa-lg q-mb-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Client</div>
          <div class="row items-center q-gutter-md">
            <q-avatar size="48px" color="accent" text-color="white">{{ getInitials(order.client?.fullName || '') }}</q-avatar>
            <div>
              <div class="text-weight-bold">{{ order.client?.fullName }}</div>
              <div class="text-sm text-grey-6">{{ order.client?.country }}</div>
            </div>
          </div>
          <q-btn flat no-caps icon="chat" label="Message Client" class="full-width q-mt-md" color="primary" @click="openChat" />
        </q-card>

        <!-- Order summary -->
        <q-card class="gg-card q-pa-lg q-mb-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Order Summary</div>
          <div class="summary-row"><span>Order ID</span><span class="text-weight-medium">#{{ order.id.slice(-8) }}</span></div>
          <div class="summary-row"><span>Amount</span><span class="text-weight-bold text-primary">${{ order.price }}</span></div>
          <div class="summary-row"><span>Due Date</span><span>{{ order.dueDate ? formatDate(order.dueDate) : '—' }}</span></div>
          <div class="summary-row"><span>Ordered On</span><span>{{ formatDate(order.createdAt) }}</span></div>
        </q-card>

        <!-- Action buttons -->
        <q-card class="gg-card q-pa-lg" v-if="['pending', 'accepted'].includes(order.status)">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Actions</div>
          <div class="q-gutter-sm">
            <q-btn v-if="order.status === 'pending'" unelevated no-caps color="positive" label="Accept Order" class="full-width" :loading="accepting" @click="acceptOrder" />
            <q-btn v-if="order.status === 'pending'" flat outline no-caps color="negative" label="Reject Order" class="full-width" @click="rejectOrderDialog = true" />
            <q-btn v-if="order.status === 'accepted'" unelevated no-caps color="primary" label="Start Working" class="full-width" @click="startWork" />
          </div>
        </q-card>
      </div>
    </div>

    <!-- Deliver Dialog -->
    <q-dialog v-model="deliverDialog">
      <q-card style="min-width:420px;max-width:95vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Deliver Your Work</div>
          <q-space /><q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <div>
            <label class="field-label">Message to Client</label>
            <q-input v-model="deliveryMessage" type="textarea" outlined dense :rows="4" placeholder="Describe what you've delivered..." />
          </div>
          <div>
            <label class="field-label">Files</label>
            <q-file v-model="deliveryFiles" outlined dense multiple label="Attach files" />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat no-caps label="Cancel" v-close-popup />
          <q-btn unelevated no-caps label="Submit Delivery" class="btn-primary" :loading="delivering" @click="submitDelivery" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Reject Dialog -->
    <q-dialog v-model="rejectOrderDialog">
      <q-card style="min-width:380px;max-width:95vw">
        <q-card-section><div class="text-h6">Reject Order</div></q-card-section>
        <q-card-section>
          <q-input v-model="rejectReason" type="textarea" outlined dense :rows="3" label="Reason for rejection" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps label="Cancel" v-close-popup />
          <q-btn unelevated no-caps color="negative" label="Reject Order" :loading="rejecting" @click="rejectOrder" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useOrderStore } from 'src/stores/order.store'
  import { useChatStore } from 'src/stores/chat.store'
  import { useNotify } from 'src/composables/useNotify'
  import { getInitials, formatDate } from 'src/utils/helpers'
  import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from 'src/utils/constants'
  import OrderStatusStepper from 'src/components/common/OrderStatusStepper.vue'

  const route = useRoute()
  const router = useRouter()
  const orderStore = useOrderStore()
  const chatStore = useChatStore()
  const notify = useNotify()

  const order = computed(() => orderStore.currentOrder)
  const deliverDialog = ref(false)
  const rejectOrderDialog = ref(false)
  const deliveryMessage = ref('')
  const deliveryFiles = ref<File[]>([])
  const rejectReason = ref('')
  const accepting = ref(false)
  const delivering = ref(false)
  const rejecting = ref(false)

  async function acceptOrder() {
    accepting.value = true
    try { await orderStore.acceptOrder(order.value!.id); notify.success('Order accepted!') }
    catch { notify.error('Failed to accept') }
    finally { accepting.value = false }
  }

  async function startWork() {
    notify.info('Order is now in progress. Good luck!')
  }

  async function rejectOrder() {
    rejecting.value = true
    try {
      await orderStore.rejectOrder(order.value!.id, rejectReason.value)
      rejectOrderDialog.value = false
      notify.success('Order rejected')
    } catch { notify.error('Failed to reject') }
    finally { rejecting.value = false }
  }

  async function submitDelivery() {
    delivering.value = true
    try {
      const fd = new FormData()
      fd.append('message', deliveryMessage.value)
      deliveryFiles.value.forEach(f => fd.append('files', f))
      await orderStore.deliverOrder(order.value!.id, fd)
      deliverDialog.value = false
      notify.success('Delivery submitted successfully!')
    } catch { notify.error('Failed to deliver') }
    finally { delivering.value = false }
  }

  async function openChat() {
    await chatStore.openConversation(order.value!.clientId, order.value!.id)
    router.push('/freelancer/messages')
  }

  onMounted(() => orderStore.fetchOrderById(route.params.id as string))
</script>