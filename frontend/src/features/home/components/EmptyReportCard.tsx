import { Button } from '@/components/common'

export interface EmptyReportCardProps {
  /** 온보딩 진단 시작으로 이동합니다. */
  onStart: () => void
}

/** 진단 이력이 없을 때(hasReport: false) 히어로 자리에 대신 보여주는 카드입니다. */
export function EmptyReportCard({ onStart }: EmptyReportCardProps) {
  return (
    <section className="flex flex-col items-center gap-4 rounded-lg border border-border-default bg-bg-surface px-6 py-14 text-center shadow-sm">
      <span
        aria-hidden
        className="flex size-14 items-center justify-center rounded-full bg-brand-subtle text-[26px]"
      >
        📊
      </span>
      <div className="flex flex-col gap-1.5">
        <h2 className="text-heading-m font-bold text-text-primary">아직 진단 전이에요</h2>
        <p className="text-body-m text-text-secondary">
          첫 진단을 마치면 폐업 위험 점수와 매출·고정비·현금흐름을 여기서 볼 수 있어요.
        </p>
      </div>
      <Button onClick={onStart}>진단 시작하기</Button>
    </section>
  )
}
