import api from './api'
import type { Wallet, WalletTransaction, WithdrawRequest, PaginatedResponse } from 'src/types'

export const walletService = {
  getWallet: () =>
    api.get<Wallet>('/wallet').then(r => r.data),

  getTransactions: (page = 1, limit = 20) =>
    api.get<PaginatedResponse<WalletTransaction>>(`/wallet/transactions?page=${page}&limit=${limit}`).then(r => r.data),

  withdraw: (payload: { amount: number; method: string; details: Record<string, string> }) =>
    api.post<WithdrawRequest>('/wallet/withdraw', payload).then(r => r.data),

  getWithdrawRequests: () =>
    api.get<WithdrawRequest[]>('/wallet/withdrawals').then(r => r.data),

  // Admin
  processWithdrawal: (id: string, status: 'completed' | 'failed') =>
    api.patch(`/admin/wallet/withdrawals/${id}`, { status }).then(r => r.data)
}
