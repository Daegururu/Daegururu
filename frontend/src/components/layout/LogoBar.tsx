import { LogoMark } from '@/components/common'
import { cn } from '@/utils/cn'

export interface LogoBarProps {
  className?: string
}

/** 회원가입·온보딩 화면 상단의 로고 바. 높이 64px 고정입니다. */
export function LogoBar({ className }: LogoBarProps) {
  return (
    <header
      className={cn(
        'flex h-16 shrink-0 items-center gap-2 border-b border-border-default bg-bg-surface px-8',
        className,
      )}
    >
      <LogoMark size={40} />
      <span className="text-[17px] leading-6 font-bold text-text-primary">대구르르</span>
    </header>
  )
}
