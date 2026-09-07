import type { CauseAnalysis } from '@/features/diagnosis/types'
import { cn } from '@/utils/cn'
import type { RiskLevel } from '@/utils/risk'

/** 강조 막대와 제목은 위험 등급 색을 따릅니다. */
const LEVEL_BG_CLASS = {
  safe: 'bg-status-safe',
  warn: 'bg-status-warn',
  danger: 'bg-status-danger',
} as const

const LEVEL_TEXT_CLASS = {
  safe: 'text-status-safe',
  warn: 'text-status-warn',
  danger: 'text-status-danger',
} as const

/** 제목은 등급 라벨(안전·주의·위험)을 그대로 반영합니다. */
const LEVEL_TITLE = {
  safe: '지금은 안정적이에요',
  warn: '왜 주의해야 하나요?',
  danger: '왜 위험한가요?',
} as const

export interface CauseCardProps {
  cause: CauseAnalysis
  level: RiskLevel
}

/** 원인 분석 카드입니다. 왼쪽에 등급 색 강조 막대가 붙습니다. */
export function CauseCard({ cause, level }: CauseCardProps) {
  return (
    <section className="flex overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-sm">
      <span aria-hidden className={cn('w-1 shrink-0', LEVEL_BG_CLASS[level])} />

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className={cn('text-heading-s font-bold', LEVEL_TEXT_CLASS[level])}>
          {LEVEL_TITLE[level]}
        </h3>

        <div className="flex flex-col">
          {cause.descriptions.map((text) => (
            <p key={text} className="text-body-l text-text-primary">
              {text}
            </p>
          ))}
        </div>

        <ul className="flex flex-col gap-1.5">
          {cause.evidences.map((text) => (
            <li key={text} className="text-body-m text-text-secondary">
              · {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
