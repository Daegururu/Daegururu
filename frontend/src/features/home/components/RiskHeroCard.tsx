import { Button, RiskGauge, StatusChip } from '@/components/common'
import type { DiagnosisSummary } from '@/features/home/types'

export interface RiskHeroCardProps {
  diagnosis: DiagnosisSummary
  /** 04 진단 리포트로 이동. 화면이 없는 동안에는 넘기지 않아 버튼이 비활성됩니다. */
  onViewReport?: () => void
}

/** 폐업 위험 점수와 원인 요약을 보여주는 히어로 카드입니다. */
export function RiskHeroCard({ diagnosis, onViewReport }: RiskHeroCardProps) {
  const { score, levelLabel, updatedAt, title, descriptions } = diagnosis

  return (
    <section className="flex items-center gap-8 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
      <RiskGauge score={score} />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <StatusChip tone="warn">{levelLabel}</StatusChip>
          <span className="text-caption text-text-tertiary">{updatedAt} 갱신</span>
        </div>

        <h2 className="text-heading-m font-bold text-text-primary">{title}</h2>

        <div className="flex flex-col">
          {descriptions.map((text) => (
            <p key={text} className="text-body-m text-text-secondary">
              {text}
            </p>
          ))}
        </div>

        <Button size="sm" className="self-start" disabled={!onViewReport} onClick={onViewReport}>
          진단 리포트 보기
        </Button>
      </div>
    </section>
  )
}
