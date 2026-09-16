/** 매출·정산 화면(06 계열)에서 쓰는 타입입니다. API 응답은 mapping.ts에서 이 형태로 바꿉니다. */

/** 필터 [구분]과 거래 추가 모달의 세그먼트가 공유하는 분류입니다. */
export type TransactionCategory = 'sales' | 'expense' | 'other'

/** 정산 상태. 필터 [정산상태]의 선택지이자 표의 정산상태 열입니다. */
export type SettlementStatus = 'completed' | 'scheduled' | 'unsettled' | 'none' | 'withdrawn'

export interface Transaction {
  id: number
  /** 거래일자 YYYY-MM-DD */
  date: string
  category: TransactionCategory
  /** 표의 구분 열. 예: "카드", "배달", "현금", "고정비" */
  method: string
  content: string
  /** 금액(원). 지출은 음수입니다. */
  amount: number
  settlement: SettlementStatus
}

/** 요약 3열 한 칸 */
export interface SalesSummaryItem {
  label: string
  value: string
  caption: string
}

/** 필터 [월 선택]과 내보내기 기간의 값. YYYY-MM */
export type SalesMonth = string

/** 거래 추가 모달에서 만드는 값. 서버 요청 본문과 같은 형태입니다. */
export interface NewTransaction {
  category: TransactionCategory
  date: string
  amount: number
  content: string
  /** 결제수단. 예: "현금" */
  method: string
  /** 진단에 반영할지 여부 */
  reflectInDiagnosis: boolean
}

/** 내보내기 모달에서 고르는 포함 항목 */
export type ExportIncludeKey = 'sales' | 'expense' | 'other' | 'scheduled'

/** ExportModal.onExport가 넘기는 값 */
export interface ExportOptions {
  period: SalesMonth
  includes: Record<ExportIncludeKey, boolean>
}
