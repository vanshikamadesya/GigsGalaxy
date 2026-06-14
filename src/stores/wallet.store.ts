import { defineStore } from 'pinia'
import { ref } from 'vue'
import { walletService } from 'src/services/wallet.service'
import type { Wallet, WalletTransaction, WithdrawRequest } from 'src/types'

export const useWalletStore = defineStore('wallet', () => {
  const wallet = ref<Wallet | null>(null)
  const transactions = ref<WalletTransaction[]>([])
  const withdrawRequests = ref<WithdrawRequest[]>([])
  const loading = ref(false)

  async function fetchWallet() {
    loading.value = true
    try {
      wallet.value = await walletService.getWallet()
    } finally {
      loading.value = false
    }
  }

  async function fetchTransactions(page = 1) {
    const result = await walletService.getTransactions(page)
    if (page === 1) {
      transactions.value = result.data
    } else {
      transactions.value.push(...result.data)
    }
  }

  async function requestWithdrawal(payload: {
    amount: number
    method: string
    details: Record<string, string>
  }) {
    const request = await walletService.withdraw(payload)
    withdrawRequests.value.unshift(request)
    if (wallet.value) {
      wallet.value.availableBalance -= payload.amount
      wallet.value.pendingBalance += payload.amount
    }
    return request
  }

  return {
    wallet,
    transactions,
    withdrawRequests,
    loading,
    fetchWallet,
    fetchTransactions,
    requestWithdrawal
  }
})
