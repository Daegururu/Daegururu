import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

export type ChatBubbleRole = 'user' | 'ai'

export interface ChatBubbleProps {
  children: ReactNode
  role?: ChatBubbleRole
  className?: string
}

export function ChatBubble({ children, role = 'ai', className }: ChatBubbleProps) {
  const isAi = role === 'ai'

  return (
    <div
      className={cn(
        'max-w-[520px] rounded-2xl px-[18px] py-3.5 text-body-m leading-6',
        isAi
          ? 'self-start rounded-br-[4px] bg-bg-subtle text-text-primary'
          : 'self-end rounded-bl-[4px] bg-brand-primary text-text-inverse',
        className,
      )}
    >
      {children}
    </div>
  )
}
