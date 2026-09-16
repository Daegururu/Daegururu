/** 금융 지원 화면(07·08·09·09b)에서 쓰는 타입입니다. API 응답은 mapping.ts에서 이 형태로 바꿉니다. */

/** 07 필터 칩의 분류. 카드의 보조 문구에도 같은 이름이 들어갑니다. */
export type ProductCategory = 'operating' | 'facility' | 'policy'

export interface FinanceProduct {
  /** 백엔드 productId. 08 상세·09 신청 경로에 그대로 씁니다. */
  id: number
  name: string
  /** 로고 자리에 넣을 짧은 글자. 예: "iM", "대구" */
  logoText: string
  provider: string
  category: ProductCategory
  /** 카드 보조 문구의 마지막 조각. 예: "골목상권 점포 대상" */
  target: string
  /** 예: "5,000만원" */
  limit: string
  /** 예: "연 2.8%" */
  rate: string
  /** 예: "5년" */
  term: string
  /** 상태 칩 문구. 예: "신청 가능" */
  status: string
  /** 자격 조건을 모두 충족하면 true. 상태 칩 색과 [신청하기] 활성에 씁니다. */
  eligible: boolean
}

/** 자격 매칭 근거 한 항목. 조건과 우리 가게의 실제 값을 나란히 보여줍니다. */
export interface EligibilityItem {
  condition: string
  evidence: string
  /** 충족 여부. 미충족 항목은 표식을 다르게 그립니다. */
  met: boolean
}

export interface FinanceProductDetail extends FinanceProduct {
  overview: string
  /** 상세 화면의 기간 표기. 예: "5년 (거치 1년)" */
  termDetail: string
  eligibility: EligibilityItem[]
  documents: string[]
  summary: { label: string; value: string }[]
  /** 오른쪽 아래 "진단 결과 연동" 안내 */
  diagnosisNote: string
}

/** 09 신청 플로우의 서류 업로드 슬롯 */
export interface DocumentSlot {
  key: string
  label: string
  /** 슬롯 안내 문구. 예: "국세청 홈택스에서 발급" */
  hint: string
}

/** 09b 신청 완료 화면에 표시할 접수 정보 */
export interface ApplicationReceipt {
  amount: string
  receiptNumber: string
  receivedAt: string
}
