import { Button, StatusChip } from '@/components/common'
import type { SupportProgram } from '@/features/home/types'
import { cn } from '@/utils/cn'

export interface SupportProgramSectionProps {
  programs: SupportProgram[]
  onViewAll: () => void
  onViewDetail: (id: string) => void
  className?: string
}

/** 추천 지원사업 카드 3열입니다. */
export function SupportProgramSection({
  programs,
  onViewAll,
  onViewDetail,
  className,
}: SupportProgramSectionProps) {
  return (
    <section className={cn('flex flex-col gap-6', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-heading-s font-bold text-text-primary">추천 지원사업</h2>
          {/* 위 진단 결과와 이어지는 영역이라는 걸 알려주는 문구입니다. */}
          <p className="text-body-s text-text-secondary">진단 결과를 반영해 고른 지원사업이에요</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          전체 보기
        </Button>
      </div>

      <ul className="grid grid-cols-3 gap-6">
        {programs.map(({ id, name, status, limit, rate }) => (
          <li
            key={id}
            className="flex flex-col gap-3 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm"
          >
            <StatusChip tone="safe" className="self-start">
              {status}
            </StatusChip>
            <h3 className="text-heading-s font-bold text-text-primary">{name}</h3>
            <div className="flex flex-col">
              <span className="text-body-m text-text-secondary">{limit}</span>
              <span className="text-body-m text-text-secondary">{rate}</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="self-start"
              onClick={() => onViewDetail(id)}
            >
              자세히 보기
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
