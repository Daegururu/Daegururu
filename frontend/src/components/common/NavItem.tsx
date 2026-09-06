import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

export interface NavItemProps {
  children: ReactNode
  /** 현재 페이지일 때 true. 사이드바에서 한 번에 하나만 active 입니다. */
  active?: boolean
  /** 아이콘. 없으면 18px 사각형 플레이스홀더가 표시됩니다. */
  icon?: ReactNode
  href?: string
  onClick?: () => void
  className?: string
}

export function NavItem({
  children,
  active = false,
  icon,
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
          )}
        />
      )}
      <span className="truncate">{children}</span>
    </>
  )

  const classes = cn(
    'flex h-11 w-full items-center gap-3 rounded-md px-4 text-left text-body-m transition-colors',
    active
      ? 'bg-brand-subtle font-medium text-text-brand'
      : 'text-text-secondary hover:bg-bg-subtle',
    className,
  )

  if (href) {
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
      aria-current={active ? 'page' : undefined}
      className={classes}
    >
      {content}
    </button>
  )
}
