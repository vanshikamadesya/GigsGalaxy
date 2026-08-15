<template>
  <q-page class="q-pa-lg">
    <h1 class="text-h5 text-weight-bold q-mb-xl">Wallet & Earnings</h1>

    <!-- Wallet Cards -->
    <div class="wallet-grid q-mb-xl">
      <q-card class="wallet-card wallet-card--primary">
        <q-card-section>
          <div class="wallet-label">Available Balance</div>
          <div class="wallet-amount">${{ (walletStore.wallet?.availableBalance || 0).toFixed(2) }}</div>
          <q-btn unelevated no-caps label="Withdraw" icon="account_balance" color="white" text-color="primary" class="q-mt-md" @click="withdrawDialog = true" />
        </q-card-section>
      </q-card>
      <q-card class="wallet-card wallet-card--warning">
        <q-card-section>
          <div class="wallet-label">Pending Balance</div>
          <div class="wallet-amount">${{ (walletStore.wallet?.pendingBalance || 0).toFixed(2) }}</div>
          <div class="wallet-desc q-mt-sm">In escrow / awaiting clearance</div>
        </q-card-section>
      </q-card>
      <q-card class="wallet-card wallet-card--success">
        <q-card-section>
          <div class="wallet-label">Total Earned</div>
          <div class="wallet-amount">${{ (walletStore.wallet?.totalEarnings || 0).toFixed(2) }}</div>
          <div class="wallet-desc q-mt-sm">All time earnings</div>
        </q-card-section>
      </q-card>
      <q-card class="wallet-card wallet-card--grey">
        <q-card-section>
          <div class="wallet-label">Total Withdrawn</div>
          <div class="wallet-amount">${{ (walletStore.wallet?.totalWithdrawn || 0).toFixed(2) }}</div>
          <div class="wallet-desc q-mt-sm">Successfully withdrawn</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Escrow Flow Banner -->
    <q-card class="gg-card q-pa-xl q-mb-xl">
      <div class="text-subtitle1 text-weight-bold q-mb-lg">How Payments Work</div>
      <div class="escrow-flow row items-center justify-between q-gutter-md">
        <div v-for="(step, i) in escrowSteps" :key="i" class="escrow-step text-center">
          <div class="escrow-icon-wrap">
            <q-icon :name="step.icon" size="28px" :color="step.color" />
          </div>
          <div class="escrow-label">{{ step.label }}</div>
        </div>
      </div>
    </q-card>

    <!-- Transaction History -->
    <q-card class="gg-card">
      <q-card-section class="row items-center justify-between">
        <div class="text-subtitle1 text-weight-bold">Transaction History</div>
        <q-btn flat no-caps icon="download" label="Export" size="sm" color="primary" />
      </q-card-section>
      <q-separator />
      <q-table
        :rows="walletStore.transactions"
        :columns="txColumns"
        flat row-key="id"
        :loading="walletStore.loading"
        :pagination="{ rowsPerPage: 15 }"
      >
        <template #body-cell-type="props">
          <q-td :props="props">
            <q-chip dense :color="getTxColor(props.value)" text-color="white" :label="props.value.replace('_', ' ')" size="sm" />
          </q-td>
        </template>
        <template #body-cell-amount="props">
          <q-td :props="props">
            <span :class="props.row.type === 'credit' || props.row.type === 'escrow_release' ? 'text-positive' : 'text-negative'" class="text-weight-bold">
              {{ props.row.type === 'credit' || props.row.type === 'escrow_release' ? '+' : '-' }}${{ props.row.amount.toFixed(2) }}
            </span>
          </q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'completed' ? 'positive' : props.value === 'pending' ? 'warning' : 'negative'" :label="props.value" />
          </q-td>
        </template>
        <template #no-data>
          <div class="full-width text-center q-pa-xl text-grey-5">No transactions yet</div>
        </template>
      </q-table>
    </q-card>

    <!-- Withdraw Dialog -->
    <q-dialog v-model="withdrawDialog" persistent>
      <q-card style="min-width:420px;max-width:95vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Withdraw Funds</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <div>
            <label class="field-label">Amount ($)</label>
            <q-input v-model.number="withdrawForm.amount" type="number" outlined dense prefix="$" :max="walletStore.wallet?.availableBalance || 0" :min="10" />
            <div class="text-xs text-grey-5 q-mt-xs">Available: ${{ (walletStore.wallet?.availableBalance || 0).toFixed(2) }}</div>
          </div>
          <div>
            <label class="field-label">Withdrawal Method</label>
            <q-select v-model="withdrawForm.method" :options="withdrawMethods" outlined dense emit-value map-options />
          </div>
          <template v-if="withdrawForm.method === 'paypal'">
            <div>
              <label class="field-label">PayPal Email</label>
              <q-input v-model="withdrawForm.details.email" outlined dense type="email" />
            </div>
          </template>
          <template v-else-if="withdrawForm.method === 'bank_transfer'">
            <div>
              <label class="field-label">Bank Account Number</label>
              <q-input v-model="withdrawForm.details.accountNumber" outlined dense />
            </div>
            <div>
              <label class="field-label">Routing/SWIFT Number</label>
              <q-input v-model="withdrawForm.details.routingNumber" outlined dense />
            </div>
          </template>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat no-caps label="Cancel" v-close-popup />
          <q-btn unelevated no-caps label="Request Withdrawal" class="btn-primary" :loading="withdrawing" @click="submitWithdraw" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useWalletStore } from 'src/stores/wallet.store'
  import { useNotify } from 'src/composables/useNotify'

  const walletStore = useWalletStore()
  const notify = useNotify()

  const withdrawDialog = ref(false)
  const withdrawing = ref(false)

  const withdrawForm = reactive({
    amount: 0,
    method: 'paypal',
    details: { email: '', accountNumber: '', routingNumber: '' }
  })

  const withdrawMethods = [
    { label: 'PayPal', value: 'paypal' },
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'Crypto (USDT)', value: 'crypto' }
  ]

  const escrowSteps = [
    { icon: 'credit_card', label: 'Client Pays', color: 'info' },
    { icon: 'lock', label: 'Funds Held in Escrow', color: 'warning' },
    { icon: 'work', label: 'You Complete Work', color: 'primary' },
    { icon: 'check_circle', label: 'Client Approves', color: 'teal' },
    { icon: 'payments', label: 'Payment Released', color: 'positive' }
  ]

  const txColumns = [
    { name: 'createdAt', label: 'Date', field: 'createdAt', format: (v: string) => new Date(v).toLocaleDateString(), align: 'left' as const },
    { name: 'description', label: 'Description', field: 'description', align: 'left' as const },
    { name: 'type', label: 'Type', field: 'type', align: 'left' as const },
    { name: 'amount', label: 'Amount', field: 'amount', align: 'right' as const },
    { name: 'balance', label: 'Balance', field: 'balance', format: (v: number) => `$${v.toFixed(2)}`, align: 'right' as const },
    { name: 'status', label: 'Status', field: 'status', align: 'left' as const }
  ]

  function getTxColor(type: string) {
    const map: Record<string, string> = { credit: 'positive', debit: 'negative', escrow_hold: 'warning', escrow_release: 'teal', withdrawal: 'info' }
    return map[type] || 'grey'
  }

  async function submitWithdraw() {
    if (!withdrawForm.amount || withdrawForm.amount < 10) { notify.error('Minimum withdrawal is $10'); return }
    if (withdrawForm.amount > (walletStore.wallet?.availableBalance || 0)) { notify.error('Insufficient balance'); return }
    withdrawing.value = true
    try {
      await walletStore.requestWithdrawal({ amount: withdrawForm.amount, method: withdrawForm.method, details: withdrawForm.details })
      withdrawDialog.value = false
      notify.success('Withdrawal request submitted!')
    } catch {
      notify.error('Withdrawal failed')
    } finally {
      withdrawing.value = false
    }
  }

  onMounted(async () => {
    walletStore.fetchWallet()
    walletStore.fetchTransactions()
  })
</script>