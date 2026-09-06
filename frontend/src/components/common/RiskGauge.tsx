import { getRiskLevel, type RiskLevel } from '@/utils/risk'
import { cn } from '@/utils/cn'

const LEVEL_LABEL: Record<RiskLevel, string> = {
  safe: '안전',
  warn: '주의',
  danger: '위험',
}

const LEVEL_CLASS: Record<RiskLevel, string> = {
  safe: 'text-status-safe',
  warn: 'text-status-warn',
  danger: 'text-status-danger',
}

const VIEW_BOX = 200
const STROKE_WIDTH = 18
const RADIUS = (VIEW_BOX - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export interface RiskGaugeProps {
  /** 폐업 위험 점수 0-100. 높을수록 위험합니다. */
  score: number
  /** 점수 아래 문구. 기본값은 "폐업위험 {안전|주의|위험}" 입니다. */
  label?: string
  /** 렌더링 크기(px). 기본 200 */
  size?: number
  className?: string
}

export function RiskGauge({ score, label, size = 200, className }: RiskGaugeProps) {
  const clamped = Math.min(100, Math.max(0, score))
  const level = getRiskLevel(clamped)

  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}
        className="size-full -rotate-90"
        role="img"
        aria-label={`폐업 위험 점수 ${clamped}점, ${LEVEL_LABEL[level]}`}
      >
        <circle
          cx={VIEW_BOX / 2}
          cy={VIEW_BOX / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE_WIDTH}
          className="stroke-current text-gray-200"
        />
        <circle
          cx={VIEW_BOX / 2}
          cy={VIEW_BOX / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - clamped / 100)}
          className={cn('stroke-current transition-[stroke-dashoffset]', LEVEL_CLASS[level])}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center">
        <span className="text-number-xl font-bold text-text-primary">{clamped}</span>
        <span className="text-caption font-medium text-text-secondary">
          {label ?? `폐업위험 ${LEVEL_LABEL[level]}`}
        </span>
      </div>
    </div>
  )
}
