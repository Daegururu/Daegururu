import type { DocumentSlot, ProductCategory } from './types'

/** 금융 지원 화면의 라벨과 고정 선택지입니다. 상품 데이터는 API에서 옵니다. */

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  operating: '운영자금',
  facility: '시설자금',
  policy: '정책자금',
}

export type CategoryFilter = 'all' | ProductCategory

export const CATEGORY_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'operating', label: '운영자금' },
  { value: 'facility', label: '시설자금' },
  { value: 'policy', label: '정책자금' },
]

/** 09 신청 플로우 단계 */
export const APPLY_STEPS = ['정보 확인', '서류 제출', '심사', '완료'] as const

/** 09 서류 업로드 슬롯 3개. 상품별 필요 서류로 바꾸는 건 신청 API가 생길 때 합니다. */
export const DOCUMENT_SLOTS: DocumentSlot[] = [
  { key: 'registration', label: '사업자등록증', hint: '국세청 홈택스에서 발급' },
  { key: 'vat', label: '부가세 과세표준증명', hint: '최근 1년치' },
  { key: 'bankbook', label: '통장 사본', hint: '입출금 계좌' },
]
