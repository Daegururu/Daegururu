import { MetricTile } from '@/components/common'
import type { MetricSummary } from '@/features/home/types'

export interface MetricSummaryGridProps {
  metrics: MetricSummary[]
}

/** 매출·고정비·정산·현금흐름 지표 타일 4열입니다. */
export function MetricSummaryGrid({ metrics }: MetricSummaryGridProps) {
  return (
    <section className="grid grid-cols-4 gap-6">
      {metrics.map(({ label, value, delta, tone }) => (
        <MetricTile key={label} label={label} value={value} delta={delta} tone={tone} />
      ))}
    </section>
  )
}
