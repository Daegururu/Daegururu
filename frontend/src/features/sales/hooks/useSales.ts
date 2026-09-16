import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getSalesSummary, getTransactions, postTransaction } from '@/apis/sales'
import type { TransactionListParams } from '@/types/sales'

import { toTransaction } from '../mapping'
import type { NewTransaction } from '../types'

const SALES_KEY = ['sales'] as const

/** 거래 목록. 필터·페이지가 바뀌는 동안 이전 표를 유지해 깜빡이지 않게 합니다. */
export function useTransactions(params: TransactionListParams) {
  return useQuery({
    queryKey: [...SALES_KEY, 'transactions', params],
    queryFn: () => getTransactions(params),
    select: (data) => ({ ...data, items: data.items.map(toTransaction) }),
    placeholderData: keepPreviousData,
  })
}

/** 요약 3열. 달이 바뀌면 다시 부릅니다. */
export function useSalesSummary(month: string) {
  return useQuery({
    queryKey: [...SALES_KEY, 'summary', month],
    queryFn: () => getSalesSummary(month),
    select: (data) => data.items,
    placeholderData: keepPreviousData,
  })
}

/** 거래 추가. 성공하면 목록·요약을 모두 다시 부릅니다(요약의 수수료·미정산액은 서버만 계산할 수 있습니다). */
export function useAddTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (transaction: NewTransaction) => postTransaction(transaction),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SALES_KEY }),
  })
}
