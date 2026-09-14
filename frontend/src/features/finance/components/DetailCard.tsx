import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

export interface DetailCardProps {
  title: string
  children: ReactNode
  className?: string
}

/** 08 상품 상세의 카드 껍데기입니다. 제목 위치와 여백을 통일합니다. */
export function DetailCard({ title, children, className }: DetailCardProps) {
  return (
    <section
      className={cn(
        'flex flex-col gap-4 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm',
        className,
      )}
    >
      <h3 className="text-heading-s font-bold text-text-primary">{title}</h3>
      {children}
    </section>
  )
}
