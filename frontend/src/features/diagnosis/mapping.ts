import { findPrescriptionDetailIdByTitle } from '@/features/diagnosis/mockData'
import type {
  CashFlowRecent,
  CauseAnalysis,
  FixedCostRow,
  FixedCostShare,
  MonthlyAmount,
  Prescription,
  ReportSummary,
  SettlementStat,
} from '@/features/diagnosis/types'
import type {
  DiagnosisCause,
  DiagnosisFixedCostItem,
  DiagnosisMonthlySeriesData,
  DiagnosisPrescription,
  DiagnosisReportData,
  DiagnosisSettlementData,
} from '@/types/diagnosis'
import { formatWon } from '@/utils/format'
import { getRiskLevel } from '@/utils/risk'

/*
 * 진단 리포트 응답을 화면 컴포넌트가 받는 형태로 바꿉니다.
 * 응답에 없는 문구(해설·강조)는 전부 여기서 만들고, 컴포넌트는 받은 값을 그대로 보여줍니다.
 */

/** 원 단위 값을 차트용 만원 단위로 줄입니다. */
const toManwon = (won: number) => Math.round(won / 10_000)

/** "2026-09" → "9월" */
function toMonthLabel(yearMonth: string): string {
  return `${Number(yearMonth.slice(5, 7))}월`
}

/** "2026-09-15" → "2026년 9월" */
function toYearMonthLabel(date: string): string {
  return `${date.slice(0, 4)}년 ${Number(date.slice(5, 7))}월`
}

/** 전월 대비 증감률(%). 전월이 0이면 null */
function diffPct(current: number, previous: number): number | null {
  if (!previous) return null
  return Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10
}

export function toReportSummary(report: DiagnosisReportData): ReportSummary {
  return {
    title: `${toYearMonthLabel(report.diagnosisDate)} 진단 리포트`,
    meta: `${report.diagnosisDate} 생성`,
    score: report.compositeScore,
    level: getRiskLevel(report.compositeScore),
    levelLabel: report.riskLevel,
  }
}

/** 원인이 여러 영역이면 설명은 영역별 한 줄씩, 근거는 전부 이어 붙입니다. */
export function toCause(causes: DiagnosisCause[]): CauseAnalysis {
  return {
    descriptions: causes.map((cause) => cause.summary),
    evidences: causes.flatMap((cause) => cause.evidence),
  }
}

export function toPrescriptions(prescriptions: DiagnosisPrescription[]): Prescription[] {
  return [...prescriptions]
    .sort((a, b) => a.rank - b.rank)
    .map(({ prescriptionId, title, description }) => ({
      id: String(prescriptionId),
      // TODO: 처방 상세 API가 없어 제목으로 목 상세를 찾습니다. 상세 API가 생기면 prescriptionId만 씁니다.
      detailId: findPrescriptionDetailIdByTitle(title) ?? null,
      title,
      description,
    }))
}

/** 월별 시리즈. 아직 집계 중인 마지막 달만 강조합니다. */
export function toMonthlyAmounts(series: DiagnosisMonthlySeriesData): MonthlyAmount[] {
  const highlightFrom = Math.max(0, series.months.length - 1)

  return series.months.map((month, index) => ({
    month: toMonthLabel(month),
    amount: toManwon(series.values[index] ?? 0),
    highlighted: index >= highlightFrom,
  }))
}

/** "9월 매출은 전월 대비 6.2% 늘었습니다." */
export function toSalesNote(series: DiagnosisMonthlySeriesData): string {
  const { months, values } = series
  if (values.length < 2) return ''

  const last = values[values.length - 1]
  const prev = values[values.length - 2]
  const pct = diffPct(last, prev)
  const label = toMonthLabel(months[months.length - 1])

  if (pct === null || pct === 0) return `${label} 매출은 전월과 비슷합니다.`
  return `${label} 매출은 전월 대비 ${Math.abs(pct)}% ${pct > 0 ? '늘었습니다' : '줄었습니다'}.`
}

export function toFixedCostShares(items: DiagnosisFixedCostItem[]): FixedCostShare[] {
  return items.map(({ category, pct }) => ({ label: category, ratio: pct }))
}

/** 전월 대비 증감은 API가 아직 주지 않아 null로 둡니다. */
export function toFixedCostRows(items: DiagnosisFixedCostItem[]): FixedCostRow[] {
  return items.map(({ category, amount, pct }) => ({
    label: category,
    amount,
    ratio: pct,
    delta: null,
  }))
}

export function toFixedCostMeta(items: DiagnosisFixedCostItem[]): string {
  const total = items.reduce((sum, item) => sum + item.amount, 0)
  return `이번 달 · 총 ${formatWon(total)}`
}

/** "인건비가 고정비의 38%를 차지합니다." */
export function toFixedCostNote(items: DiagnosisFixedCostItem[]): string {
  if (items.length === 0) return ''
  const largest = items.reduce((max, item) => (item.pct > max.pct ? item : max))
  return `${largest.category}가 고정비의 ${largest.pct}%를 차지합니다.`
}

/** 최근 3개월. 최신 달이 위에 옵니다. */
export function toRecentCashFlow(series: DiagnosisMonthlySeriesData): CashFlowRecent[] {
  const { months, values } = series
  return months
    .map((month, index) => ({ month: toMonthLabel(month), amount: values[index] ?? 0 }))
    .slice(-3)
    .reverse()
}

/** "2개월 연속 마이너스 · 3개월 누적 -830,000원" */
export function toRecentCashFlowNote(series: DiagnosisMonthlySeriesData): string {
  const recent = series.values.slice(-3)
  const total = recent.reduce((sum, value) => sum + value, 0)

  let negativeStreak = 0
  for (const value of [...series.values].reverse()) {
    if (value >= 0) break
    negativeStreak += 1
  }

  const streak = negativeStreak > 0 ? `${negativeStreak}개월 연속 마이너스` : '최근 달 플러스'
  return `${streak} · 3개월 누적 ${total > 0 ? '+' : ''}${formatWon(total)}`
}

export function toCashFlowNote(series: DiagnosisMonthlySeriesData): string {
  const { months, values } = series
  const last = values[values.length - 1]
  const label = toMonthLabel(months[months.length - 1])

  if (last < 0) return `${label} 순현금흐름이 ${formatWon(last)}으로 마이너스입니다.`
  return `${label} 순현금흐름은 +${formatWon(last)}입니다.`
}

export function toSettlementStats(settlement: DiagnosisSettlementData): SettlementStat[] {
  return [
    {
      label: '평균 수수료율',
      value: `${settlement.avgFeeRatePct}%`,
      caption: '카드·배달 정산 기준',
    },
    {
      label: '평균 정산 소요일',
      value: `${settlement.avgSettlementLagDays}일`,
      caption: '매출 발생부터 입금까지',
    },
  ]
}
