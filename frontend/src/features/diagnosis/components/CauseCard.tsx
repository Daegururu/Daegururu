import type { CauseAnalysis } from '@/features/diagnosis/types'

export interface CauseCardProps {
  cause: CauseAnalysis
}

/** "왜 위험한가요?" 원인 분석 카드입니다. 왼쪽에 강조 막대가 붙습니다. */
export function CauseCard({ cause }: CauseCardProps) {
  return (
    <section className="flex overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-sm">
      <span aria-hidden className="w-1 shrink-0 bg-status-warn" />

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="text-heading-s font-bold text-status-warn">왜 위험한가요?</h3>

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
