/**
 * GET /api/v1/diagnosis/report 계열 응답의 result. envelope 안에 camelCase로 내려옵니다.
 * hasReport·hasData가 false면 나머지 필드가 없으므로 판별 유니온으로 둡니다.
 */

export interface DiagnosisCause {
  /** 예: "costStructure" */
  area: string
  summary: string
  evidence: string[]
}

export interface DiagnosisPrescription {
  prescriptionId: number
  rank: number
  title: string
  description: string
}

export interface DiagnosisReportData {
  reportId: number
  /** 진단일 YYYY-MM-DD */
  diagnosisDate: string
  compositeScore: number
  /** 예: "주의" */
  riskLevel: string
  causes: DiagnosisCause[]
  prescriptions: DiagnosisPrescription[]
}

export type DiagnosisReport = { hasReport: false } | ({ hasReport: true } & DiagnosisReportData)

/** 매출 추이·현금흐름 탭이 같은 형태입니다. 최근 12개월, 단위는 원입니다. */
export interface DiagnosisMonthlySeriesData {
  unit: string
  /** YYYY-MM */
  months: string[]
  values: number[]
}

export type DiagnosisMonthlySeries =
  { hasData: false } | ({ hasData: true } & DiagnosisMonthlySeriesData)

export interface DiagnosisFixedCostItem {
  category: string
  amount: number
  pct: number
}

export type DiagnosisFixedCost =
  { hasData: false } | { hasData: true; items: DiagnosisFixedCostItem[] }

export interface DiagnosisSettlementData {
  /** 평균 수수료율(%) */
  avgFeeRatePct: number
  /** 평균 정산 소요일 */
  avgSettlementLagDays: number
}

export type DiagnosisSettlement = { hasData: false } | ({ hasData: true } & DiagnosisSettlementData)
