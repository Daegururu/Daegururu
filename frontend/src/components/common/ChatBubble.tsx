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
        'w-fit max-w-[520px] rounded-2xl px-[18px] py-3.5 text-body-m leading-6',
        // 부모가 flex가 아니어도 정렬되도록 self-* 대신 margin auto를 사용합니다.
        isAi
          ? 'mr-auto rounded-br-[4px] bg-bg-subtle text-text-primary'
          : 'ml-auto rounded-bl-[4px] bg-brand-primary text-text-inverse',
        className,
      )}
    >
      {children}
    </div>
  )
}
