import type { ReactNode } from 'react'

import { LogoMark } from '@/components/common'
import { cn } from '@/utils/cn'

export interface LogoBarProps {
  /** 오른쪽 끝에 붙는 보조 문구. 예: 신청 중인 상품명 */
  trailing?: ReactNode
  className?: string
}

/** 회원가입·온보딩·신청 플로우 화면 상단의 로고 바. 높이 64px 고정입니다. */
export function LogoBar({ trailing, className }: LogoBarProps) {
  return (
    <header
      className={cn(
        'flex h-16 shrink-0 cursor-default items-center justify-between gap-4 border-b border-border-default bg-bg-surface px-8',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <LogoMark size={40} />
        <span className="text-[17px] leading-6 font-bold text-text-primary">대구르르</span>
      </div>

      {trailing && <span className="text-body-m text-text-secondary">{trailing}</span>}
    </header>
  )
}
