/** GET /api/v1/sales/transactions · GET /api/v1/sales/summary · POST /api/v1/sales/transactions 요청·응답. */

export interface TransactionResponse {
  id: number
  /** 거래일자 YYYY-MM-DD */
  date: string
  /** sales | expense | other */
  category: string
  /** 결제수단. 카드/현금/배달/계좌이체/고정비. 없으면 null */
  method: string | null
  content: string | null
  /** 금액(원). 고정비는 서버가 음수로 내려줍니다. */
  amount: number
  /** completed | scheduled | unsettled | none | withdrawn */
  settlement: string
}

export interface TransactionListResponse {
  items: TransactionResponse[]
  page: number
  totalPages: number
  totalCount: number
}

export interface TransactionListParams {
  /** YYYY-MM */
  month: string
  /** all | sales | expense | other */
  category: string
  /** all | completed | scheduled | unsettled | none | withdrawn */
  settlement: string
  page: number
}

/** 요약 3열은 서버가 표시 문구까지 만들어 내려줍니다. 수수료율·미정산액은 프론트에서 계산할 수 없습니다. */
export interface SalesSummaryResponse {
  items: { label: string; value: string; caption: string }[]
}

export interface TransactionCreateRequest {
  /** sales | expense | other */
  category: string
  /** YYYY-MM-DD */
  date: string
  /** 항상 양수. 지출 여부는 category로 판단합니다. */
  amount: number
  content: string
  method: string
  reflectInDiagnosis: boolean
}
