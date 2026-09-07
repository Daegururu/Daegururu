/** 진단 리포트 화면(04 계열)에서 쓰는 타입입니다. API 연동 전까지는 mockData가 이 형태를 채웁니다. */

import type { RiskLevel } from '@/utils/risk'

export interface ReportSummary {
  /** 예: "2026년 8월 진단 리포트" */
  title: string
  /** 예: "2026-08-29 생성 · 영수네 국밥 (한식 음식점업)" */
  meta: string
  /** 종합 위험 점수 0-100 */
  score: number
  level: RiskLevel
  /** 위험 등급 칩 문구. 예: "주의" */
  levelLabel: string
}

/** 탭 하나를 식별하는 값입니다. 라우트가 아니라 화면 안의 상태입니다. */
export type ReportTab = 'sales' | 'fixedCost' | 'cashFlow' | 'settlement'

export interface MonthlyAmount {
  /** x축 라벨. 예: "8월" */
  month: string
  /** 금액(만원) */
  amount: number
  /** 최근 3개월처럼 강조해서 보여줄 구간이면 true */
  highlighted?: boolean
}

export interface FixedCostRow {
  label: string
  /** 금액(원) */
  amount: number
  /** 고정비에서 차지하는 비중(%) */
  ratio: number
  /** 전월 대비 증감(%p). 0이면 변화 없음 */
  delta: number
}

export interface FixedCostShare {
  label: string
  ratio: number
}

export interface CashFlowRecent {
  /** 예: "8월" */
  month: string
  /** 순현금흐름(원) */
  amount: number
}

export interface SettlementRow {
  /** 정산 예정일 YYYY-MM-DD */
  date: string
  /** 예: "카드", "배달" */
  kind: string
  content: string
  /** 금액(원) */
  amount: number
  /** 예: "정산 예정", "정산 완료" */
  status: string
}

export interface CauseAnalysis {
  /** 원인 설명. 줄바꿈 단위로 나눠 둡니다. */
  descriptions: string[]
  /** 근거 목록 */
  evidences: string[]
}

export interface Prescription {
  id: string
  title: string
  description: string
}

/** 04e 처방 실행 화면의 상세 내용입니다. */
export interface PrescriptionDetail extends Prescription {
  /** 예: "진단 리포트가 제안한 처방입니다 · 예상 절감 월 620,000원 · 9월 급여부터 반영 가능" */
  meta: string
  currentState: {
    label: string
    value: string
    caption: string
    tone: 'danger' | 'brand' | 'neutral'
  }[]
  steps: { title: string; description: string }[]
  /** 적용 전후 비교표 */
  effects: { label: string; before: string; after: string; diff: string }[]
  summary: { label: string; value: string }[]
  /** 법적 유의사항. 문단 단위로 나눠 둡니다. */
  notices: string[]
}
