import { client } from '@/apis/client'
import type { Envelope } from '@/types/envelope'
import type {
  SalesSummaryResponse,
  TransactionCreateRequest,
  TransactionListParams,
  TransactionListResponse,
  TransactionResponse,
} from '@/types/sales'

/** 거래 목록. 한 페이지 8건은 서버 고정이라 페이지 크기를 넘길 수 없습니다. */
export async function getTransactions(
  params: TransactionListParams,
): Promise<TransactionListResponse> {
  const { data } = await client.get<Envelope<TransactionListResponse>>('/sales/transactions', {
    params,
  })
  return data.result
}

/** 총매출 / 수수료 / 실정산액 요약. 문구까지 서버가 만듭니다. */
export async function getSalesSummary(month: string): Promise<SalesSummaryResponse> {
  const { data } = await client.get<Envelope<SalesSummaryResponse>>('/sales/summary', {
    params: { month },
  })
  return data.result
}

export async function postTransaction(
  body: TransactionCreateRequest,
): Promise<TransactionResponse> {
  const { data } = await client.post<Envelope<TransactionResponse>>('/sales/transactions', body)
  return data.result
}

/**
 * 한 달치 거래 전체. 인쇄 요약본은 페이지네이션 없이 다 필요한데 서버가 8건씩만 주므로
 * 첫 페이지의 totalPages만큼 이어서 받습니다.
 */
export async function getAllTransactions(month: string): Promise<TransactionResponse[]> {
  const base = { month, category: 'all', settlement: 'all' }
  const first = await getTransactions({ ...base, page: 1 })
  if (first.totalPages <= 1) return first.items

  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, index) =>
      getTransactions({ ...base, page: index + 2 }),
    ),
  )
  return [...first.items, ...rest.flatMap((page) => page.items)]
}
