import type { HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

/** safe=안전·연동됨 / warn=주의 / danger=위험 / info=정보 */
export type StatusChipTone = 'safe' | 'warn' | 'danger' | 'info'

const TONE_CLASS: Record<StatusChipTone, string> = {
  safe: 'bg-status-safe-bg text-status-safe',
  warn: 'bg-status-warn-bg text-status-warn',
  danger: 'bg-status-danger-bg text-status-danger',
  info: 'bg-brand-subtle text-text-brand',
}

export interface StatusChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusChipTone
}

export function StatusChip({ tone = 'safe', className, ...props }: StatusChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-3 py-1.5',
        'text-caption font-medium whitespace-nowrap',
        TONE_CLASS[tone],
        className,
      )}
      {...props}
    />
  )
}
