/** GET /api/v1/finance/products · GET /api/v1/finance/products/{product_id} 응답. 표시 문구는 서버가 만들어 내려줍니다. */

export interface FinanceProductResponse {
  productId: number
  name: string
  /** 로고 자리에 넣을 짧은 글자. 예: "iM", "대구" */
  logoText: string
  provider: string
  /** operating | facility | policy */
  category: string
  /** 카드 보조 문구의 마지막 조각. 예: "골목상권 점포 대상" */
  target: string
  /** 예: "5,000만원" */
  limit: string
  /** 예: "연 2.8%" */
  rate: string
  /** 예: "5년" */
  term: string
  /** "신청 가능" | "자격 미충족" */
  status: string
}

export interface FinanceMatchBanner {
  /** 예: "사업기간 3년 2개월 · 월매출 1,842만원 · 한식 음식점업 기준" */
  title: string
  description: string
}

export interface FinanceProductListResponse {
  /** 가게 정보가 없으면 null */
  matchBanner: FinanceMatchBanner | null
  /** 신청 가능한 상품이 앞에 옵니다. */
  products: FinanceProductResponse[]
}

export interface FinanceEligibilityItem {
  condition: string
  /** 우리 가게의 실제 값. 예: "최근 12개월 2억 2,104만원" */
  evidence: string
  met: boolean
}

export interface FinanceProductDetailResponse extends FinanceProductResponse {
  overview: string
  /** 예: "5년 (거치 1년)" */
  termDetail: string
  eligibility: FinanceEligibilityItem[]
  documents: string[]
  summary: { label: string; value: string }[]
  /** 오른쪽 아래 "진단 결과 연동" 안내 */
  diagnosisNote: string
}
