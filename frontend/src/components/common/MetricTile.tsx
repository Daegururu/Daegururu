import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils/cn'

/** 증감이 좋은 방향이면 positive, 나쁜 방향이면 negative, 중립이면 neutral */
export type MetricTileTone = 'positive' | 'negative' | 'neutral'

const DELTA_CLASS: Record<MetricTileTone, string> = {
  positive: 'text-status-safe',
  negative: 'text-status-danger',
  neutral: 'text-text-secondary',
}

export interface MetricTileProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode
  value: ReactNode
  /** 예: "▲ 6.2% 전월 대비" */
  delta?: ReactNode
  tone?: MetricTileTone
}

export function MetricTile({
  label,
  value,
  delta,
  tone = 'neutral',
  className,
  ...props
}: MetricTileProps) {
  return (
    <div
      className={cn(
        'flex min-h-[140px] flex-col gap-2 rounded-lg border border-border-default',
        'bg-bg-surface p-6 shadow-sm',
        className,
      )}
      {...props}
    >
      <p className="text-body-s font-medium text-text-secondary">{label}</p>
      <p className="text-number-l font-bold text-text-primary">{value}</p>
      {/* delta가 0일 때도 표시해야 하므로 truthy 검사 대신 null 검사를 씁니다. */}
      {delta != null && (
        <p className={cn('text-caption font-medium', DELTA_CLASS[tone])}>{delta}</p>
      )}
    </div>
  )
}
