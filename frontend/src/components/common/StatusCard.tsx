import { Button } from '@/components/common/Button'

export interface StatusCardProps {
  /** 불러오는 중이면 true. 문구만 바뀝니다. */
  loading?: boolean
  /** 불러오는 중 문구. 화면마다 다르게 쓸 수 있습니다. */
  loadingMessage?: string
  /** 실패 문구. 있으면 [다시 시도] 버튼이 붙습니다. */
  errorMessage?: string
  onRetry?: () => void
}

/** 화면 데이터를 불러오는 중이거나 실패했을 때 본문 자리에 보여주는 카드입니다. */
export function StatusCard({
  loading = false,
  loadingMessage = '불러오는 중이에요...',
  errorMessage,
  onRetry,
}: StatusCardProps) {
  return (
    <section
      role={errorMessage ? 'alert' : 'status'}
      className="flex flex-col items-center gap-4 rounded-lg border border-border-default bg-bg-surface px-6 py-14 text-center shadow-sm"
    >
      <p className="text-body-m text-text-secondary">{loading ? loadingMessage : errorMessage}</p>
      {errorMessage && onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </section>
  )
}
