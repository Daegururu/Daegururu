import { cn } from '@/utils/cn'

export interface SpinnerProps {
  /** 지름(px). 기본 24 */
  size?: number
  /** 스크린 리더가 읽을 문구. 기본 "불러오는 중" */
  label?: string
  className?: string
}

/** 도는 원형 로딩 표시입니다. 테두리 한 쪽만 브랜드색으로 칠해 회전시킵니다. */
export function Spinner({ size = 24, label = '불러오는 중', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block shrink-0 animate-spin rounded-full border-[3px] border-border-default border-t-brand-primary',
        className,
      )}
      style={{ width: size, height: size }}
    />
  )
}
