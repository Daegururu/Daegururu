import { Button, StatusChip } from '@/components/common'
import type { ExternalProgram } from '@/features/finance/types'

export interface ExternalProgramCardProps {
  program: ExternalProgram
  onViewDetail: (id: number) => void
}

/** 07 지원사업 공고 카드 한 줄. 기관 · 대상 · 신청기간과 출처 칩 + [자세히 보기] 순입니다. */
export function ExternalProgramCard({ program, onViewDetail }: ExternalProgramCardProps) {
  const { id, title, agency, target, applyPeriod, sourceLabel } = program

  return (
    <li className="flex items-center gap-6 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="truncate text-heading-s font-bold text-text-primary">{title}</h3>
        <p className="text-body-s text-text-secondary">
          {agency} · {target || '대상 제한 없음'}
        </p>
      </div>

      <dl className="flex shrink-0 flex-col gap-0.5">
        <dd className="text-body-m font-bold whitespace-nowrap text-text-primary">{applyPeriod}</dd>
        <dt className="text-caption text-text-tertiary">신청 기간</dt>
      </dl>

      <div className="flex shrink-0 flex-col items-end gap-2.5">
        <StatusChip tone="info">{sourceLabel}</StatusChip>
        <Button onClick={() => onViewDetail(id)}>자세히 보기</Button>
      </div>
    </li>
  )
}
