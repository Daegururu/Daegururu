/**
 * GET /api/v1/finance/products · /products/{product_id} · /external-programs/{program_id} 응답.
 * 표시 문구는 서버가 만들어 내려줍니다.
 */

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

/** 기업마당 등 외부에서 동기화한 지원사업 공고. 자격 매칭은 하지 않고 마감 안 지난 공고만 옵니다. */
export interface ExternalProgramResponse {
  programId: number
  title: string
  /** 소관기관. 예: "중소벤처기업부" */
  agency: string
  /** 지원 대상. 예: "소상공인" */
  target: string
  /** 예: "2026-09-01 ~ 2026-09-30". 기간이 없으면 null */
  applyPeriod: string | null
  /** 공고 원문 주소. [신청하러 가기]가 새 탭으로 엽니다. */
  detailUrl: string
  /** 출처. 예: "bizinfo" */
  source: string
}

export interface ExternalProgramDetailResponse extends ExternalProgramResponse {
  /** 지원분야. 예: "금융" */
  category: string
  /** 공고 요약. 줄바꿈으로 문단이 나뉩니다. */
  summary: string
}

export interface FinanceProductListResponse {
  /** 가게 정보가 없으면 null */
  matchBanner: FinanceMatchBanner | null
  /** 신청 가능한 상품이 앞에 옵니다. */
  products: FinanceProductResponse[]
  /** 최신 공고가 앞에 옵니다. 최대 20개 */
  externalPrograms: ExternalProgramResponse[]
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
