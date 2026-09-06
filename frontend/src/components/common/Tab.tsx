import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

export interface TabProps {
  children: ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
}

export function Tab({ children, active = false, onClick, className }: TabProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2.5 px-1 text-body-m whitespace-nowrap transition-colors',
        active ? 'font-medium text-text-brand' : 'text-text-secondary hover:text-text-primary',
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn('h-0.5 w-full', active ? 'bg-brand-primary' : 'bg-transparent')}
      />
    </button>
  )
}
