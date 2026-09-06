import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

/** done=완료(✓) / current=진행 중 / todo=예정 */
export type StepItemState = 'done' | 'current' | 'todo'

const MARKER_CLASS: Record<StepItemState, string> = {
  done: 'bg-status-safe text-text-inverse',
  current: 'bg-brand-primary text-text-inverse',
  todo: 'border border-border-default bg-bg-surface text-text-tertiary',
}

const LABEL_CLASS: Record<StepItemState, string> = {
  done: 'text-text-secondary',
  current: 'font-medium text-text-primary',
  todo: 'text-text-tertiary',
}

export interface StepItemProps {
  children: ReactNode
  /** 단계 번호. done 상태에서는 번호 대신 체크 표시가 나옵니다. */
  step: number
  state?: StepItemState
  className?: string
}

export function StepItem({ children, step, state = 'todo', className }: StepItemProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-full',
          'text-body-s font-medium',
          MARKER_CLASS[state],
        )}
      >
        {state === 'done' ? '✓' : step}
      </span>
      <span className={cn('text-body-m whitespace-nowrap', LABEL_CLASS[state])}>{children}</span>
    </div>
  )
}
