import type { ReactNode } from 'react'

import { Button } from '@/components/common/Button'
import { cn } from '@/utils/cn'

export interface EmptyReportCardProps {
  /** 온보딩 진단 시작으로 이동합니다. */
  onStart: () => void
  /** 카드 설명. 화면마다 보여줄 것이 달라 바꿔 씁니다. 줄을 나누려면 <br />를 넣습니다. */
  description?: ReactNode
  /** 여백처럼 놓이는 자리에 따라 달라지는 값만 넘깁니다. */
  className?: string
}

/** 진단 이력이 없을 때(hasReport: false) 히어로 자리에 대신 보여주는 카드입니다. */
export function EmptyReportCard({
  onStart,
  description = '첫 진단을 마치면 폐업 위험 점수와 매출·고정비·현금흐름을 여기서 볼 수 있어요.',
  className,
}: EmptyReportCardProps) {
  return (
    <section
      className={cn(
        'flex flex-col items-center gap-4 rounded-lg border border-border-default bg-bg-surface px-6 py-14 text-center shadow-sm',
        className,
      )}
    >
      <span
        aria-hidden
        className="flex size-14 items-center justify-center rounded-full bg-brand-subtle text-[26px]"
      >
        📊
      </span>
      <div className="flex flex-col gap-1.5">
        <h2 className="text-heading-m font-bold text-text-primary">아직 진단 전이에요</h2>
        <p className="text-body-m text-text-secondary">{description}</p>
      </div>
      <Button onClick={onStart}>진단 시작하기</Button>
    </section>
  )
}
