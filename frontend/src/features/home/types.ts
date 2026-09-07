/** 홈 대시보드에서 쓰는 데이터 타입입니다. API 연동 전까지는 mockData가 이 형태를 채웁니다. */

export interface DiagnosisSummary {
  /** 폐업 위험 점수 0-100 */
  score: number
  /** 위험 단계 라벨. 예: "주의 단계" */
  levelLabel: string
  /** 갱신일 YYYY-MM-DD */
  updatedAt: string
  title: string
  /** 원인 설명. 줄바꿈 단위로 나눠 둡니다. */
  descriptions: string[]
}

export interface MetricSummary {
  label: string
  value: string
  delta: string
  tone: 'positive' | 'negative' | 'neutral'
}

export interface CashFlowPoint {
  /** x축 라벨. 예: "8월" */
  month: string
  /** 순현금흐름(원) */
  amount: number
}

export interface FixedCostItem {
  label: string
  /** 우리 가게 비중(%) */
  ratio: number
  /** 동일 상권·업종 평균 비중(%) */
  averageRatio: number
}

export interface SupportProgram {
  id: string
  name: string
  /** 신청 상태 칩 문구. 예: "신청 가능" */
  status: string
  limit: string
  rate: string
}
