/** GET /api/v1/dashboard/summary 응답의 result. envelope 안에 camelCase로 내려옵니다. */

export type DiffDirection = 'up' | 'down' | 'same'

export interface DashboardRisk {
  /** 종합 위험 점수 0-100 */
  compositeScore: number
  /** 예: "주의" */
  riskLevel: string
  /** 진단일 YYYY-MM-DD */
  updatedAt: string
  summary: string
}

export interface DashboardMetrics {
  monthlySales: { amount: number; diffPct: number | null; diffDirection: DiffDirection | null }
  /** 전월 대비 증감은 백엔드가 아직 null로 보냅니다. */
  fixedCostRatio: { valuePct: number; diffPct: number | null; diffDirection: DiffDirection | null }
  /** 정산 API 연동 전이라 amount는 0 고정입니다. */
  settlementUpcoming: { amount: number; note: string }
  cashflow: { amount: number; note: string }
}

export interface DashboardCashflowChart {
  unit: string
  /** YYYY-MM 12개 */
  months: string[]
  values: number[]
  industryAvgReference: { available: boolean; value: number | null; source: string | null }
}

export interface DashboardFixedCostItem {
  category: string
  pct: number
  /** 업종 평균이 없으면 null */
  industryAvgPct: number | null
}

export interface DashboardProduct {
  productId: number
  name: string
  limitAmount: number
  interestRate: number
}

/** hasReport가 false면 risk·metrics·차트는 null이고 recommendedProducts는 빈 배열입니다. */
export interface DashboardSummary {
  hasReport: boolean
  risk: DashboardRisk | null
  metrics: DashboardMetrics | null
  cashflowChart: DashboardCashflowChart | null
  fixedCostBreakdown: { items: DashboardFixedCostItem[]; industryAvgAvailable: boolean } | null
  recommendedProducts: DashboardProduct[]
}
