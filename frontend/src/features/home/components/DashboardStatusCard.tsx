import { Button } from '@/components/common'

export interface DashboardStatusCardProps {
  /** 불러오는 중이면 true. 문구만 바뀝니다. */
  loading?: boolean
  /** 실패 문구. 있으면 [다시 시도] 버튼이 붙습니다. */
  errorMessage?: string
  onRetry?: () => void
}

/** 대시보드 데이터를 불러오는 중이거나 실패했을 때 히어로 자리에 보여주는 카드입니다. */
export function DashboardStatusCard({
  loading = false,
  errorMessage,
  onRetry,
}: DashboardStatusCardProps) {
  return (
    <section
      role={errorMessage ? 'alert' : 'status'}
      className="flex flex-col items-center gap-4 rounded-lg border border-border-default bg-bg-surface px-6 py-14 text-center shadow-sm"
    >
      <p className="text-body-m text-text-secondary">
        {loading ? '가게 상태를 불러오는 중이에요...' : errorMessage}
      </p>
      {errorMessage && onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </section>
  )
}
