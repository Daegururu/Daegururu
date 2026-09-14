import type { SelectOption } from '@/components/common'

import type {
  SalesMonth,
  SalesSummaryItem,
  SettlementStatus,
  Transaction,
  TransactionCategory,
} from './types'

/*
 * 매출·정산 목데이터입니다.
 * 8월(2026-08)만 진단 리포트 수치와 맞춘 실데이터 성격이고, 7·6월은 필터 동작 확인용입니다.
 * 인건비·임대료는 features/diagnosis/mockData.ts의 고정비 표와 같은 값입니다.
 * API 연동 시 MOCK_TRANSACTIONS와 MOCK_SUMMARY_BY_MONTH를 응답으로 교체합니다.
 */

export const PAGE_SIZE = 8

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

export const MONTH_OPTIONS: readonly SelectOption<SalesMonth>[] = [
  { value: '2026-08', label: '2026년 8월' },
  { value: '2026-07', label: '2026년 7월' },
  { value: '2026-06', label: '2026년 6월' },
]

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

/** 내보내기 모달의 기간 선택지 */
export const EXPORT_PERIOD_OPTIONS: readonly SelectOption<SalesMonth>[] = [
  { value: '2026-08', label: '2026년 8월 1일 ~ 8월 31일' },
  { value: '2026-07', label: '2026년 7월 1일 ~ 7월 31일' },
  { value: '2026-06', label: '2026년 6월 1일 ~ 6월 30일' },
]

export const MOCK_SUMMARY_BY_MONTH: Record<SalesMonth, SalesSummaryItem[]> = {
  '2026-08': [
    { label: '총매출', value: '18,420,000원', caption: '카드 12,840,000 · 현금 5,580,000' },
    { label: '수수료', value: '512,000원', caption: '평균 수수료율 2.78%' },
    { label: '실정산액', value: '17,908,000원', caption: '미정산 3,180,000원 포함' },
  ],
  '2026-07': [
    { label: '총매출', value: '17,340,000원', caption: '카드 12,120,000 · 현금 5,220,000' },
    { label: '수수료', value: '486,000원', caption: '평균 수수료율 2.80%' },
    { label: '실정산액', value: '16,854,000원', caption: '미정산 0원' },
  ],
  '2026-06': [
    { label: '총매출', value: '16,600,000원', caption: '카드 11,580,000 · 현금 5,020,000' },
    { label: '수수료', value: '462,000원', caption: '평균 수수료율 2.78%' },
    { label: '실정산액', value: '16,138,000원', caption: '미정산 0원' },
  ],
}

/** 최신 거래가 위에 오도록 날짜 내림차순으로 둡니다. 한 줄에 한 건씩입니다. */
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't-0828-1',
    date: '2026-08-28',
    category: 'sales',
    method: '카드',
    content: '저녁 매출 정산분',
    amount: 612000,
    settlement: 'completed',
  },
  {
    id: 't-0828-2',
    date: '2026-08-28',
    category: 'sales',
    method: '배달',
    content: '배달앱 정산 (수수료 14.2%)',
    amount: 384000,
    settlement: 'completed',
  },
  {
    id: 't-0827-1',
    date: '2026-08-27',
    category: 'sales',
    method: '카드',
    content: '점심 매출 정산분',
    amount: 412000,
    settlement: 'completed',
  },
  {
    id: 't-0827-2',
    date: '2026-08-27',
    category: 'sales',
    method: '현금',
    content: '현금 매출',
    amount: 198000,
    settlement: 'none',
  },
  {
    id: 't-0826-1',
    date: '2026-08-26',
    category: 'sales',
    method: '카드',
    content: '저녁 매출 정산분',
    amount: 704000,
    settlement: 'scheduled',
  },
  {
    id: 't-0826-2',
    date: '2026-08-26',
    category: 'sales',
    method: '배달',
    content: '배달앱 정산 (수수료 14.2%)',
    amount: 341000,
    settlement: 'scheduled',
  },
  {
    id: 't-0825-1',
    date: '2026-08-25',
    category: 'expense',
    method: '고정비',
    content: '8월 인건비 지급',
    amount: -4400000,
    settlement: 'withdrawn',
  },
  {
    id: 't-0825-2',
    date: '2026-08-25',
    category: 'expense',
    method: '고정비',
    content: '8월 임대료',
    amount: -1800000,
    settlement: 'withdrawn',
  },
  {
    id: 't-0824-1',
    date: '2026-08-24',
    category: 'sales',
    method: '카드',
    content: '주말 매출 정산분',
    amount: 856000,
    settlement: 'scheduled',
  },
  {
    id: 't-0824-2',
    date: '2026-08-24',
    category: 'sales',
    method: '배달',
    content: '배달앱 정산 (수수료 14.2%)',
    amount: 402000,
    settlement: 'unsettled',
  },
  {
    id: 't-0823-1',
    date: '2026-08-23',
    category: 'sales',
    method: '카드',
    content: '주말 매출 정산분',
    amount: 912000,
    settlement: 'scheduled',
  },
  {
    id: 't-0823-2',
    date: '2026-08-23',
    category: 'sales',
    method: '현금',
    content: '현금 매출',
    amount: 236000,
    settlement: 'none',
  },
  {
    id: 't-0822-1',
    date: '2026-08-22',
    category: 'sales',
    method: '카드',
    content: '저녁 매출 정산분',
    amount: 648000,
    settlement: 'completed',
  },
  {
    id: 't-0822-2',
    date: '2026-08-22',
    category: 'expense',
    method: '고정비',
    content: '8월 전기·가스 요금',
    amount: -620000,
    settlement: 'withdrawn',
  },
  {
    id: 't-0821-1',
    date: '2026-08-21',
    category: 'sales',
    method: '카드',
    content: '점심 매출 정산분',
    amount: 388000,
    settlement: 'completed',
  },
  {
    id: 't-0821-2',
    date: '2026-08-21',
    category: 'sales',
    method: '배달',
    content: '배달앱 정산 (수수료 14.2%)',
    amount: 356000,
    settlement: 'unsettled',
  },
  {
    id: 't-0820-1',
    date: '2026-08-20',
    category: 'sales',
    method: '카드',
    content: '저녁 매출 정산분',
    amount: 592000,
    settlement: 'completed',
  },
  {
    id: 't-0820-2',
    date: '2026-08-20',
    category: 'other',
    method: '기타',
    content: '식자재 반품 환불',
    amount: 84000,
    settlement: 'none',
  },
  {
    id: 't-0819-1',
    date: '2026-08-19',
    category: 'sales',
    method: '카드',
    content: '점심 매출 정산분',
    amount: 421000,
    settlement: 'completed',
  },
  {
    id: 't-0819-2',
    date: '2026-08-19',
    category: 'sales',
    method: '현금',
    content: '현금 매출',
    amount: 174000,
    settlement: 'none',
  },
  {
    id: 't-0818-1',
    date: '2026-08-18',
    category: 'sales',
    method: '카드',
    content: '저녁 매출 정산분',
    amount: 634000,
    settlement: 'completed',
  },
  {
    id: 't-0818-2',
    date: '2026-08-18',
    category: 'expense',
    method: '고정비',
    content: '배달앱 월 이용료',
    amount: -88000,
    settlement: 'withdrawn',
  },
  {
    id: 't-0817-1',
    date: '2026-08-17',
    category: 'sales',
    method: '카드',
    content: '주말 매출 정산분',
    amount: 878000,
    settlement: 'completed',
  },
  {
    id: 't-0817-2',
    date: '2026-08-17',
    category: 'sales',
    method: '배달',
    content: '배달앱 정산 (수수료 14.2%)',
    amount: 412000,
    settlement: 'completed',
  },
  {
    id: 't-0816-1',
    date: '2026-08-16',
    category: 'sales',
    method: '카드',
    content: '주말 매출 정산분',
    amount: 934000,
    settlement: 'completed',
  },
  {
    id: 't-0816-2',
    date: '2026-08-16',
    category: 'sales',
    method: '현금',
    content: '현금 매출',
    amount: 262000,
    settlement: 'none',
  },
  {
    id: 't-0815-1',
    date: '2026-08-15',
    category: 'sales',
    method: '카드',
    content: '공휴일 매출 정산분',
    amount: 812000,
    settlement: 'completed',
  },
  {
    id: 't-0814-1',
    date: '2026-08-14',
    category: 'sales',
    method: '카드',
    content: '저녁 매출 정산분',
    amount: 602000,
    settlement: 'completed',
  },
  {
    id: 't-0814-2',
    date: '2026-08-14',
    category: 'other',
    method: '기타',
    content: '단체 예약금 입금',
    amount: 300000,
    settlement: 'none',
  },
  {
    id: 't-0813-1',
    date: '2026-08-13',
    category: 'sales',
    method: '카드',
    content: '점심 매출 정산분',
    amount: 396000,
    settlement: 'completed',
  },
  {
    id: 't-0812-1',
    date: '2026-08-12',
    category: 'sales',
    method: '배달',
    content: '배달앱 정산 (수수료 14.2%)',
    amount: 368000,
    settlement: 'completed',
  },
  {
    id: 't-0811-1',
    date: '2026-08-11',
    category: 'sales',
    method: '카드',
    content: '저녁 매출 정산분',
    amount: 588000,
    settlement: 'completed',
  },
  {
    id: 't-0729-1',
    date: '2026-07-29',
    category: 'sales',
    method: '카드',
    content: '저녁 매출 정산분',
    amount: 574000,
    settlement: 'completed',
  },
  {
    id: 't-0728-1',
    date: '2026-07-28',
    category: 'sales',
    method: '배달',
    content: '배달앱 정산 (수수료 14.2%)',
    amount: 352000,
    settlement: 'completed',
  },
  {
    id: 't-0725-1',
    date: '2026-07-25',
    category: 'expense',
    method: '고정비',
    content: '7월 인건비 지급',
    amount: -3730000,
    settlement: 'withdrawn',
  },
  {
    id: 't-0725-2',
    date: '2026-07-25',
    category: 'expense',
    method: '고정비',
    content: '7월 임대료',
    amount: -1800000,
    settlement: 'withdrawn',
  },
  {
    id: 't-0724-1',
    date: '2026-07-24',
    category: 'sales',
    method: '현금',
    content: '현금 매출',
    amount: 186000,
    settlement: 'none',
  },
  {
    id: 't-0629-1',
    date: '2026-06-29',
    category: 'sales',
    method: '카드',
    content: '저녁 매출 정산분',
    amount: 548000,
    settlement: 'completed',
  },
  {
    id: 't-0625-1',
    date: '2026-06-25',
    category: 'expense',
    method: '고정비',
    content: '6월 인건비 지급',
    amount: -3680000,
    settlement: 'withdrawn',
  },
  {
    id: 't-0625-2',
    date: '2026-06-25',
    category: 'expense',
    method: '고정비',
    content: '6월 임대료',
    amount: -1800000,
    settlement: 'withdrawn',
  },
]

/** 상단바에 표시할 사용자 정보 */
export const MOCK_USER = '김영수 사장님 · 대구 중구 동성로'
