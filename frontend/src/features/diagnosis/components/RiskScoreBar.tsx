import { StatusChip } from '@/components/common'
import type { ReportSummary } from '@/features/diagnosis/types'
import { cn } from '@/utils/cn'

/** 위험 구간. utils/risk.ts의 등급 기준(0-40 / 41-75 / 76-100)과 같은 값입니다. */
const ZONES = [
  { level: 'safe', label: '안전 0-40', width: 40, className: 'bg-status-safe' },
  { level: 'warn', label: '주의 41-75', width: 35, className: 'bg-status-warn' },
  { level: 'danger', label: '위험 76-100', width: 25, className: 'bg-status-danger' },
] as const

const CHIP_TONE = {
  safe: 'safe',
  warn: 'warn',
  danger: 'danger',
} as const

/** 점수 숫자와 마커, 현재 구간 라벨은 모두 등급 색을 따릅니다. */
const LEVEL_TEXT_CLASS = {
  safe: 'text-status-safe',
  warn: 'text-status-warn',
  danger: 'text-status-danger',
} as const

const LEVEL_BORDER_CLASS = {
  safe: 'border-status-safe',
  warn: 'border-status-warn',
  danger: 'border-status-danger',
} as const

export interface RiskScoreBarProps {
  report: ReportSummary
}

/** 종합 위험 점수와 구간 막대입니다. 점수 위치에 원형 마커를 놓습니다. */
export function RiskScoreBar({ report }: RiskScoreBarProps) {
  const { score, level, levelLabel } = report
  const clamped = Math.min(100, Math.max(0, score))

  return (
    <section className="flex items-center gap-8 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
      <div className="flex shrink-0 flex-col">
        <span className={cn('text-number-xl font-bold', LEVEL_TEXT_CLASS[level])}>{clamped}</span>
        <span className="text-caption whitespace-nowrap text-text-secondary">종합 위험 점수</span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="relative h-5">
          <div className="absolute inset-x-0 top-1/2 flex h-3 -translate-y-1/2 overflow-hidden rounded-full">
            {ZONES.map(({ label, width, className }) => (
              <span key={label} className={className} style={{ width: `${width}%` }} />
            ))}
          </div>
          {/* 마커는 점수 위치에 놓고, 좌우 끝에서 잘리지 않도록 절반만큼 당깁니다. */}
          <span
            className={cn(
              'absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full',
              'border-[3px] bg-bg-surface',
              LEVEL_BORDER_CLASS[level],
            )}
            style={{ left: `${clamped}%` }}
          />
        </div>

        <div className="flex justify-between text-caption">
          {ZONES.map((zone) => (
            <span
              key={zone.label}
              className={zone.level === level ? LEVEL_TEXT_CLASS[level] : 'text-text-tertiary'}
            >
              {zone.label}
            </span>
          ))}
        </div>
      </div>

      <StatusChip tone={CHIP_TONE[level]}>{levelLabel}</StatusChip>
    </section>
  )
}
