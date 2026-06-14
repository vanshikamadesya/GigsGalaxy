<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-xl">
      <q-btn flat round icon="arrow_back" to="/client/orders" class="q-mr-sm" />
      <h1 class="text-h5 text-weight-bold">Order Details</h1>
      <q-space />
      <q-badge v-if="order" :color="ORDER_STATUS_COLORS[order.status]" :label="ORDER_STATUS_LABELS[order.status]" class="q-pa-sm" />
    </div>

    <div v-if="orderStore.loading" class="skeleton" style="height:400px;border-radius:16px" />

    <div v-else-if="order" class="row q-col-gutter-xl">
      <div class="col-12 col-md-8">
        <q-card class="gg-card q-pa-lg q-mb-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Order Progress</div>
          <OrderStatusStepper :status="order.status" />
        </q-card>

        <q-card class="gg-card q-pa-lg q-mb-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Gig Details</div>
          <div class="row items-center q-gutter-md">
            <q-img :src="order.gig?.images?.[0]" style="width:80px;height:60px;border-radius:8px" />
            <div>
              <div class="text-weight-bold">{{ order.gig?.title }}</div>
              <div class="text-sm text-grey-6 capitalize">{{ order.packageType }} Package · ${{ order.price }}</div>
            </div>
          </div>
        </q-card>

        <!-- Deliverables (when status is delivered) -->
        <q-card v-if="order.deliverables?.length" class="gg-card q-pa-lg q-mb-lg">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold">Delivered Files</div>
            <q-badge color="teal" label="Delivered" />
          </div>
          <q-item v-for="d in order.deliverables" :key="d.id" dense>
            <q-item-section avatar><q-icon name="attachment" color="primary" /></q-item-section>
            <q-item-section><q-item-label>{{ d.fileName }}</q-item-label></q-item-section>
            <q-item-section side>
              <q-btn flat round dense icon="download" :href="d.fileUrl" target="_blank" />
            </q-item-section>
          </q-item>
          <div v-if="order.status === 'delivered'" class="row q-gutter-sm q-mt-md">
            <q-btn unelevated no-caps color="positive" label="Approve & Release Payment" class="col" :loading="completing" @click="completeOrder" />
            <q-btn flat outline no-caps color="warning" label="Request Revision" @click="revisionDialog = true" />
          </div>
        </q-card>

        <!-- Leave a review (after completion) -->
        <q-card v-if="order.status === 'completed' && !hasReviewed" class="gg-card q-pa-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Leave a Review</div>
          <div class="q-gutter-md">
            <div>
              <label class="field-label">Rating</label>
              <div class="row q-gutter-xs">
                <q-btn v-for="i in 5" :key="i" flat round :icon="i <= reviewForm.rating ? 'star' : 'star_border'" :color="i <= reviewForm.rating ? 'warning' : 'grey-4'" size="md" @click="reviewForm.rating = i" />
              </div>
            </div>
            <div>
              <label class="field-label">Review Comment</label>
              <q-input v-model="reviewForm.comment" type="textarea" outlined dense :rows="4" placeholder="Share your experience..." />
            </div>
            <q-btn unelevated no-caps class="btn-primary" label="Submit Review" :loading="submittingReview" @click="submitReview" />
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="gg-card q-pa-lg q-mb-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Freelancer</div>
          <div class="row items-center q-gutter-md">
            <q-avatar size="48px" color="primary" text-color="white">{{ getInitials(order.freelancer?.user?.fullName || '') }}</q-avatar>
            <div>
              <div class="text-weight-bold">{{ order.freelancer?.user?.fullName }}</div>
              <StarRating :rating="order.freelancer?.averageRating || 0" size="12px" />
            </div>
          </div>
          <q-btn flat no-caps icon="chat" label="Message Freelancer" class="full-width q-mt-md" color="primary" @click="openChat" />
        </q-card>

        <q-card class="gg-card q-pa-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Order Summary</div>
          <div class="summary-row"><span>Order ID</span><span>#{{ order.id.slice(-8) }}</span></div>
          <div class="summary-row"><span>Amount</span><span class="text-weight-bold text-primary">${{ order.price }}</span></div>
          <div class="summary-row"><span>Status</span><q-badge :color="ORDER_STATUS_COLORS[order.status]" :label="ORDER_STATUS_LABELS[order.status]" /></div>
          <div class="summary-row"><span>Due Date</span><span>{{ order.dueDate ? formatDate(order.dueDate) : '—' }}</span></div>
          <div class="summary-row"><span>Placed On</span><span>{{ formatDate(order.createdAt) }}</span></div>
          <q-btn v-if="order.status === 'pending'" flat outline no-caps color="negative" label="Cancel Order" class="full-width q-mt-md" @click="cancelOrder" />
        </q-card>
      </div>
    </div>

    <!-- Revision Dialog -->
    <q-dialog v-model="revisionDialog">
      <q-card style="min-width:380px">
        <q-card-section><div class="text-h6">Request Revision</div></q-card-section>
        <q-card-section>
          <q-input v-model="revisionNotes" type="textarea" outlined dense :rows="4" label="What needs to be changed?" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps label="Cancel" v-close-popup />
          <q-btn unelevated no-caps class="btn-primary" label="Send Request" @click="requestRevision" />
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
  import { reviewService } from 'src/services/review.service'
  import { orderService } from 'src/services/order.service'
  import { useNotify } from 'src/composables/useNotify'
  import { getInitials, formatDate } from 'src/utils/helpers'
  import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from 'src/utils/constants'
  import OrderStatusStepper from 'src/components/common/OrderStatusStepper.vue'
  import StarRating from 'src/components/common/StarRating.vue'

  const route = useRoute()
  const router = useRouter()
  const orderStore = useOrderStore()
  const chatStore = useChatStore()
  const notify = useNotify()

  const order = computed(() => orderStore.currentOrder)
  const completing = ref(false)
  const revisionDialog = ref(false)
  const revisionNotes = ref('')
  const hasReviewed = ref(false)
  const submittingReview = ref(false)
  const reviewForm = ref({ rating: 5, comment: '' })

  async function completeOrder() {
    completing.value = true
    try {
      await orderStore.completeOrder(order.value!.id)
      notify.success('Payment released! Thank you for using GigGalaxy.')
    } catch { notify.error('Failed') }
    finally { completing.value = false }
  }

  async function requestRevision() {
    await orderService.requestRevision(order.value!.id, revisionNotes.value)
    revisionDialog.value = false
    notify.success('Revision request sent')
  }

  async function cancelOrder() {
    notify.confirm('Cancel this order?', async () => {
      await orderStore.cancelOrder(order.value!.id, 'Cancelled by client')
      notify.success('Order cancelled')
    })
  }

  async function submitReview() {
    submittingReview.value = true
    try {
      await reviewService.createReview({ orderId: order.value!.id, ...reviewForm.value })
      hasReviewed.value = true
      notify.success('Review submitted!')
    } catch { notify.error('Failed to submit review') }
    finally { submittingReview.value = false }
  }

  async function openChat() {
    await chatStore.openConversation(order.value!.freelancerId, order.value!.id)
    router.push('/client/messages')
  }

  onMounted(() => orderStore.fetchOrderById(route.params.id as string))
</script>

<style lang="scss" scoped>
  @use 'src/styles/variables' as *;
  .summary-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid $border-color; font-size: $font-size-sm; .body--dark & { border-bottom-color: $border-color-dark; } &:last-child { border-bottom: none; } }
  .field-label { font-size: $font-size-sm; font-weight: 500; color: $text-secondary; display: block; margin-bottom: 4px; }
</style>
