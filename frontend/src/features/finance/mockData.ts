import type { DocumentSlot, FinanceProductDetail, ProductCategory } from './types'

/*
 * 금융 지원 목데이터입니다.
 * TODO: 홈 추천 지원사업은 이제 API의 productId(숫자)로 넘어옵니다. 금융 API 연동 시 id 체계를 맞춥니다.
 * 08 상세는 Figma에 iM뱅크 1건만 있어 나머지 2건은 같은 구조로 채워 넣었습니다.
 * API 연동 시 MOCK_PRODUCTS를 응답으로 교체합니다.
 */

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

export const MOCK_MATCH_BANNER = {
  title: '사업기간 3년 2개월 · 월매출 1,842만원 · 한식 음식점업 기준',
  description:
    '신청 가능한 소상공인 지원사업 3건을 찾았습니다. 현금흐름 개선 효과가 큰 순서로 정렬했습니다.',
}

export const MOCK_PRODUCTS: FinanceProductDetail[] = [
  {
    id: 'daegu-alley',
    name: '대구시 골목상권 활력자금',
    logoText: '대구',
    provider: '대구광역시',
    category: 'policy',
    target: '골목상권 점포 대상',
    limit: '2,000만원',
    rate: '연 1.5%',
    term: '3년',
    termDetail: '3년 (거치 1년)',
    status: '신청 가능',
    overview:
      '대구광역시가 골목상권 점포의 운영 안정을 위해 지원하는 정책자금입니다. 시 이차보전으로 금리가 가장 낮고, 거치기간 1년 후 2년 원리금 균등분할 상환 조건입니다.',
    eligibility: [
      { condition: '대구광역시 골목상권 소재', evidence: '대구 중구 동성로2가' },
      { condition: '사업기간 6개월 이상', evidence: '영수네 국밥 · 3년 2개월' },
      { condition: '연매출 3억원 이하', evidence: '최근 12개월 2억 2,104만원' },
      { condition: '국세·지방세 체납 없음', evidence: '2026-08-29 기준 체납 없음' },
      { condition: '동일 자금 미수령', evidence: '최근 3년 수령 이력 없음' },
    ],
    documents: [
      '사업자등록증 사본',
      '부가세 과세표준증명원 (최근 1년)',
      '지방세 완납증명서',
      '통장 사본',
    ],
    summary: [
      { label: '예상 한도', value: '2,000만원' },
      { label: '적용 금리', value: '연 1.5%' },
      { label: '월 상환액(추정)', value: '846,000원' },
      { label: '심사 기간', value: '영업일 5일' },
    ],
    diagnosisNote:
      '금리가 가장 낮아 2개월 연속 마이너스인 순현금흐름을 메우는 데 부담이 가장 적습니다.',
    application: {
      amount: '20,000,000원',
      receiptNumber: 'DG-2026-0829-0112',
      receivedAt: '2026-08-29',
    },
  },
  {
    id: 'im-bank',
    name: 'iM뱅크 소상공인 특별운영자금',
    logoText: 'iM',
    provider: 'iM뱅크',
    category: 'operating',
    target: '대구 소재 소상공인 우대',
    limit: '5,000만원',
    rate: '연 2.8%',
    term: '5년',
    termDetail: '5년 (거치 1년)',
    status: '신청 가능',
    overview:
      '대구 소재 소상공인의 운영자금을 지원하는 iM뱅크 특별 상품입니다. 골목상권 점포에는 우대금리 0.4%p가 추가 적용되며, 거치기간 1년 후 4년 원리금 균등분할 상환 조건입니다.',
    eligibility: [
      { condition: '사업기간 1년 이상', evidence: '영수네 국밥 · 3년 2개월' },
      { condition: '대구광역시 소재 사업장', evidence: '대구 중구 동성로2가' },
      { condition: '연매출 3억원 이하', evidence: '최근 12개월 2억 2,104만원' },
      { condition: '국세·지방세 체납 없음', evidence: '2026-08-29 기준 체납 없음' },
      { condition: '동일 목적 정책자금 미수령', evidence: '최근 3년 수령 이력 없음' },
    ],
    documents: [
      '사업자등록증 사본',
      '부가세 과세표준증명원 (최근 1년)',
      '국세·지방세 완납증명서',
      '통장 사본 (iM뱅크 계좌)',
    ],
    summary: [
      { label: '예상 한도', value: '5,000만원' },
      { label: '적용 금리', value: '연 2.8%' },
      { label: '월 상환액(추정)', value: '1,116,000원' },
      { label: '심사 기간', value: '영업일 3일' },
    ],
    diagnosisNote:
      '현재 고정비 비중이 42.8%로 높아, 거치기간 1년 조건이 현금흐름 개선에 유리합니다.',
    application: {
      amount: '30,000,000원',
      receiptNumber: 'IM-2026-0829-0417',
      receivedAt: '2026-08-29',
    },
  },
  {
    id: 'semas',
    name: '소상공인시장진흥공단 정책자금',
    logoText: '소진',
    provider: '소진공',
    category: 'policy',
    target: '업력 1년 이상',
    limit: '7,000만원',
    rate: '연 3.2%',
    term: '5년',
    termDetail: '5년 (거치 2년)',
    status: '신청 가능',
    overview:
      '소상공인시장진흥공단이 직접 대출하는 일반경영안정자금입니다. 한도가 가장 크고 거치기간 2년 후 3년 원리금 균등분할 상환 조건이라 당장의 상환 부담이 적습니다.',
    eligibility: [
      { condition: '업력 1년 이상', evidence: '영수네 국밥 · 3년 2개월' },
      { condition: '상시 근로자 5인 미만', evidence: '근로자 4명' },
      { condition: '연매출 10억원 이하', evidence: '최근 12개월 2억 2,104만원' },
      { condition: '국세·지방세 체납 없음', evidence: '2026-08-29 기준 체납 없음' },
      { condition: '소진공 자금 잔액 한도 내', evidence: '기존 대출 없음' },
    ],
    documents: [
      '사업자등록증 사본',
      '부가세 과세표준증명원 (최근 1년)',
      '국세·지방세 완납증명서',
      '소상공인 확인서',
    ],
    summary: [
      { label: '예상 한도', value: '7,000만원' },
      { label: '적용 금리', value: '연 3.2%' },
      { label: '월 상환액(추정)', value: '1,318,000원' },
      { label: '심사 기간', value: '영업일 10일' },
    ],
    diagnosisNote:
      '거치기간이 2년으로 가장 길어 인건비 구조 점검이 효과를 내기 전까지 상환 부담을 미룰 수 있습니다.',
    application: {
      amount: '50,000,000원',
      receiptNumber: 'SE-2026-0829-0263',
      receivedAt: '2026-08-29',
    },
  },
]

/** 09 신청 플로우 단계 */
export const APPLY_STEPS = ['정보 확인', '서류 제출', '심사', '완료'] as const

/** 09 서류 업로드 슬롯 3개 */
export const DOCUMENT_SLOTS: DocumentSlot[] = [
  { key: 'registration', label: '사업자등록증', hint: '국세청 홈택스에서 발급' },
  { key: 'vat', label: '부가세 과세표준증명', hint: '최근 1년치' },
  { key: 'bankbook', label: '통장 사본', hint: '입출금 계좌' },
]

/** id로 상품을 찾습니다. 없으면 undefined입니다. */
export function findProduct(id: string): FinanceProductDetail | undefined {
  return MOCK_PRODUCTS.find((product) => product.id === id)
}

/** 상단바에 표시할 사용자 정보 */
export const MOCK_USER = '김영수 사장님 · 대구 중구 동성로'
