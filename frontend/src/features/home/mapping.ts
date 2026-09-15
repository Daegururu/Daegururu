import { findProductIdByName } from '@/features/finance/mockData'
import type {
  CashFlowPoint,
  DiagnosisSummary,
  FixedCostItem,
  MetricSummary,
  SupportProgram,
} from '@/features/home/types'
import type {
  DashboardCashflowChart,
  DashboardFixedCostItem,
  DashboardMetrics,
  DashboardProduct,
  DashboardRisk,
  DiffDirection,
} from '@/types/dashboard'
import { formatWon } from '@/utils/format'
import { getRiskLevel } from '@/utils/risk'

/*
 * 대시보드 응답을 화면 컴포넌트가 받는 형태로 바꿉니다.
 * 숫자를 문구로 만드는 일은 전부 여기서 하고, 컴포넌트는 받은 문자열을 그대로 보여줍니다.
 */

export function toDiagnosisSummary(risk: DashboardRisk): DiagnosisSummary {
  return {
    score: risk.compositeScore,
    level: getRiskLevel(risk.compositeScore),
    levelLabel: `${risk.riskLevel} 단계`,
    updatedAt: risk.updatedAt,
    title: `폐업 위험 ${risk.riskLevel} 단계`,
    descriptions: [risk.summary],
  }
}

/** "▲ 6.2% 전월 대비" 형태. 증감이 없으면 "전월 대비 -"로 둡니다. */
function formatDiff(diffPct: number | null, direction: DiffDirection | null, unit: string) {
  if (diffPct === null || direction === null) return '전월 대비 -'
  const arrow = direction === 'up' ? '▲' : direction === 'down' ? '▼' : '—'
  return `${arrow} ${Math.abs(diffPct)}${unit} 전월 대비`
}

export function toMetrics(metrics: DashboardMetrics): MetricSummary[] {
  const { monthlySales, fixedCostRatio, settlementUpcoming, cashflow } = metrics

  return [
    {
      label: '이번 달 매출',
      value: formatWon(monthlySales.amount),
      delta: formatDiff(monthlySales.diffPct, monthlySales.diffDirection, '%'),
      // 매출은 늘어야 좋은 방향입니다.
      tone:
        monthlySales.diffDirection === 'up'
          ? 'positive'
          : monthlySales.diffDirection === 'down'
            ? 'negative'
            : 'neutral',
    },
    {
      label: '고정비 비중',
      value: `${fixedCostRatio.valuePct}%`,
      delta: formatDiff(fixedCostRatio.diffPct, fixedCostRatio.diffDirection, '%p'),
      // 고정비 비중은 줄어야 좋은 방향입니다.
      tone:
        fixedCostRatio.diffDirection === 'down'
          ? 'positive'
          : fixedCostRatio.diffDirection === 'up'
            ? 'negative'
            : 'neutral',
    },
    {
      label: '정산 예정',
      value: formatWon(settlementUpcoming.amount),
      delta: settlementUpcoming.note,
      tone: 'neutral',
    },
    {
      label: '현금흐름',
      value: formatWon(cashflow.amount),
      delta: cashflow.note,
      tone: cashflow.amount < 0 ? 'negative' : 'positive',
    },
  ]
}

/** "2026-08" → "8월" */
function toMonthLabel(yearMonth: string): string {
  const month = Number(yearMonth.slice(5, 7))
  return `${month}월`
}

export function toCashFlowPoints(chart: DashboardCashflowChart): CashFlowPoint[] {
  return chart.months.map((month, index) => ({
    month: toMonthLabel(month),
    amount: chart.values[index] ?? 0,
  }))
}

export function toFixedCostItems(items: DashboardFixedCostItem[]): FixedCostItem[] {
  return items.map(({ category, pct, industryAvgPct }) => ({
    label: category,
    ratio: pct,
    averageRatio: industryAvgPct,
  }))
}

/** 도넛 아래 한 줄. 비중이 가장 큰 항목을 짚어줍니다. */
export function toFixedCostNote(items: FixedCostItem[]): string {
  if (items.length === 0) return ''
  const largest = items.reduce((max, item) => (item.ratio > max.ratio ? item : max))
  return `${largest.label} 비중이 가장 큽니다`
}

/** 20000000 → "한도 2,000만원" */
function formatLimit(amount: number): string {
  return `한도 ${(amount / 10_000).toLocaleString('ko-KR')}만원`
}

export function toSupportPrograms(products: DashboardProduct[]): SupportProgram[] {
  return products.map(({ productId, name, limitAmount, interestRate }) => ({
    // TODO: 08 상세가 목데이터라 상품명으로 목 id를 찾습니다. 금융 API 연동(#32) 후 productId만 씁니다.
    id: findProductIdByName(name) ?? String(productId),
    name,
    status: '신청 가능',
    limit: formatLimit(limitAmount),
    rate: `금리 연 ${interestRate}%`,
  }))
}
