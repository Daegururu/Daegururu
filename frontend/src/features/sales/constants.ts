import type { SelectOption } from '@/components/common'

import type { SettlementStatus, TransactionCategory } from './types'

/** 매출·정산 화면의 라벨과 셀렉트 선택지입니다. 월 선택지는 mapping.ts에서 오늘 기준으로 만듭니다. */

export const SETTLEMENT_LABEL: Record<SettlementStatus, string> = {
  completed: '정산 완료',
  scheduled: '정산 예정',
  unsettled: '미정산',
  none: '해당 없음',
  withdrawn: '출금 완료',
}

export const CATEGORY_LABEL: Record<TransactionCategory, string> = {
  sales: '매출',
  expense: '고정비·지출',
  other: '기타',
}

export type CategoryFilter = 'all' | TransactionCategory

export const CATEGORY_OPTIONS: readonly SelectOption<CategoryFilter>[] = [
  { value: 'all', label: '전체 구분' },
  { value: 'sales', label: '매출' },
  { value: 'expense', label: '고정비·지출' },
  { value: 'other', label: '기타' },
]

export type SettlementFilter = 'all' | 'completed' | 'scheduled' | 'unsettled'

export const SETTLEMENT_OPTIONS: readonly SelectOption<SettlementFilter>[] = [
  { value: 'all', label: '전체 정산상태' },
  { value: 'completed', label: '정산완료' },
  { value: 'scheduled', label: '정산예정' },
  { value: 'unsettled', label: '미정산' },
]

/** 거래 추가 모달의 결제수단 선택지 */
export const PAYMENT_METHOD_OPTIONS: readonly SelectOption<string>[] = [
  { value: '현금', label: '현금' },
  { value: '카드', label: '카드' },
  { value: '배달', label: '배달' },
  { value: '계좌이체', label: '계좌이체' },
]

/** 필터·내보내기 월 선택지에 보여줄 최근 개월 수 */
export const RECENT_MONTH_COUNT = 6
