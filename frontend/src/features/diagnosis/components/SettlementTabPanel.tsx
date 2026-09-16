import { ReportCard } from '@/features/diagnosis/components/ReportCard'
import type { SettlementStat } from '@/features/diagnosis/types'

export interface SettlementTabPanelProps {
  stats: SettlementStat[]
  note: string
}

/**
 * 정산 탭. API가 평균 수수료율·평균 정산 소요일만 주므로 지표 타일 2개로 보여줍니다.
 * 카드사별 건별 내역은 정산 API가 생기면 표로 붙입니다.
 */
export function SettlementTabPanel({ stats, note }: SettlementTabPanelProps) {
  return (
    <ReportCard title="정산 현황" meta="이번 달 기준" note={note}>
      <dl className="grid grid-cols-2 gap-4">
        {stats.map(({ label, value, caption }) => (
          <div key={label} className="flex flex-col gap-1 rounded-md bg-bg-subtle px-5 py-4">
            <dt className="text-body-s text-text-secondary">{label}</dt>
            <dd className="text-number-l font-bold text-text-primary">{value}</dd>
            <dd className="text-caption text-text-tertiary">{caption}</dd>
          </div>
        ))}
      </dl>
    </ReportCard>
  )
}
