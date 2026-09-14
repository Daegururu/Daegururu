/** 매출·정산 화면(06 계열)에서 쓰는 타입입니다. API 연동 전까지는 mockData가 이 형태를 채웁니다. */

/** 필터 [구분]과 거래 추가 모달의 세그먼트가 공유하는 분류입니다. */
export type TransactionCategory = 'sales' | 'expense' | 'other'

/** 정산 상태. 필터 [정산상태]의 선택지이자 표의 정산상태 열입니다. */
export type SettlementStatus = 'completed' | 'scheduled' | 'unsettled' | 'none' | 'withdrawn'

export interface Transaction {
  id: string
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

/** 필터 [월 선택]의 값. YYYY-MM */
export type SalesMonth = '2026-08' | '2026-07' | '2026-06'

/** 거래 추가 모달에서 만드는 값. id와 표시용 method는 저장할 때 붙입니다. */
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
