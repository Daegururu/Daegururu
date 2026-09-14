import { cn } from '@/utils/cn'

export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  /** 스크린 리더가 읽을 이름 */
  ariaLabel: string
  disabled?: boolean
  className?: string
}

/** 알림 설정처럼 켜고 끄는 스위치입니다. 44×24 크기 고정입니다. */
export function Toggle({ checked, onChange, ariaLabel, disabled = false, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
        'focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-40',
        checked ? 'bg-brand-primary' : 'bg-border-strong',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute top-0.5 left-0.5 size-5 rounded-full bg-bg-surface shadow-sm transition-transform',
          checked && 'translate-x-5',
        )}
      />
    </button>
  )
}
