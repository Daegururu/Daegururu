import logoMark from '@/assets/logo-mark.png'
import { cn } from '@/utils/cn'

export interface LogoMarkProps {
  /** 렌더링 크기(px). 기본 32 */
  size?: number
  className?: string
}

/** 대구르르 로고 마크. 워드마크 옆에 배치합니다. */
export function LogoMark({ size = 32, className }: LogoMarkProps) {
  return (
    <img
      src={logoMark}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={cn('shrink-0 object-cover', className)}
      style={{ width: size, height: size }}
    />
  )
}
