import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

export interface NavItemProps {
  children: ReactNode
  /** 현재 페이지일 때 true. 사이드바에서 한 번에 하나만 active 입니다. */
  active?: boolean
  /** 아이콘. 없으면 18px 사각형 플레이스홀더가 표시됩니다. */
  icon?: ReactNode
  /** 아직 만들지 않은 화면처럼 누를 수 없는 메뉴일 때 true */
  disabled?: boolean
  href?: string
  onClick?: () => void
  className?: string
}

export function NavItem({
  children,
  active = false,
  icon,
  disabled = false,
  href,
  onClick,
  className,
}: NavItemProps) {
  const content = (
    <>
      {icon ?? (
        <span
          aria-hidden
          className={cn(
            'size-[18px] shrink-0 rounded-sm',
            active ? 'bg-brand-primary' : 'bg-text-tertiary',
            disabled && 'bg-border-default',
          )}
        />
      )}
      <span className="truncate">{children}</span>
    </>
  )

  const classes = cn(
    'flex h-11 w-full items-center gap-3 rounded-md px-4 text-left text-body-m transition-colors',
    active && 'bg-brand-subtle font-medium text-text-brand',
    !active && !disabled && 'text-text-secondary hover:bg-bg-subtle',
    disabled && 'cursor-not-allowed text-text-tertiary',
    className,
  )

  if (href && !disabled) {
    return (
      <a href={href} aria-current={active ? 'page' : undefined} className={classes}>
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
      className={classes}
    >
      {content}
    </button>
  )
}
