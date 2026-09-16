import type { SelectOption } from '@/components/common'
import type { TransactionResponse } from '@/types/sales'
import { daysInMonth, recentMonths } from '@/utils/date'

import { RECENT_MONTH_COUNT } from './constants'
import type { SalesMonth, SettlementStatus, Transaction, TransactionCategory } from './types'

const CATEGORIES: readonly TransactionCategory[] = ['sales', 'expense', 'other']
const SETTLEMENTS: readonly SettlementStatus[] = [
  'completed',
  'scheduled',
  'unsettled',
  'none',
  'withdrawn',
]

function toCategory(value: string): TransactionCategory {
  return (CATEGORIES as readonly string[]).includes(value)
    ? (value as TransactionCategory)
    : 'other'
}

function toSettlement(value: string): SettlementStatus {
  return (SETTLEMENTS as readonly string[]).includes(value) ? (value as SettlementStatus) : 'none'
}

/** 거래 응답을 표에서 쓰는 형태로 바꿉니다. 모르는 분류·정산 상태는 기타·해당 없음으로 둡니다. */
export function toTransaction(response: TransactionResponse): Transaction {
  return {
    id: response.id,
    date: response.date,
    category: toCategory(response.category),
    method: response.method ?? '기타',
    content: response.content ?? '',
    amount: response.amount,
    settlement: toSettlement(response.settlement),
  }
}

/** "2026-08" → "2026년 8월" */
export function formatMonthLabel(month: SalesMonth): string {
  const [year, monthIndex] = month.split('-').map(Number)
  return `${year}년 ${monthIndex}월`
}

/** "2026-08" → "2026년 8월 1일 ~ 8월 31일" */
export function formatMonthRangeLabel(month: SalesMonth): string {
  const [year, monthIndex] = month.split('-').map(Number)
  return `${year}년 ${monthIndex}월 1일 ~ ${monthIndex}월 ${daysInMonth(month)}일`
}

/** 필터 [월 선택] 선택지. 이번 달부터 최근 N개월입니다. */
export function buildMonthOptions(now?: Date): SelectOption<SalesMonth>[] {
  return recentMonths(RECENT_MONTH_COUNT, now).map((month) => ({
    value: month,
    label: formatMonthLabel(month),
  }))
}

/** 내보내기 [기간] 선택지. 월 선택지와 같은 달을 기간 문구로 보여줍니다. */
export function buildExportPeriodOptions(now?: Date): SelectOption<SalesMonth>[] {
  return recentMonths(RECENT_MONTH_COUNT, now).map((month) => ({
    value: month,
    label: formatMonthRangeLabel(month),
  }))
}
