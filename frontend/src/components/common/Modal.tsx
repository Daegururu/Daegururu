import { useEffect, type ReactNode } from 'react'

import { cn } from '@/utils/cn'

const SIZE_CLASS = {
  md: 'max-w-[480px]',
  lg: 'max-w-[640px]',
} as const

export interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  /** 스크린 리더가 읽을 모달 제목 */
  ariaLabel?: string
  size?: keyof typeof SIZE_CLASS
  /**
   * 기본 여백과 가운데 정렬을 적용할지 여부입니다.
   * 헤더·본문·푸터를 직접 구성하는 모달은 false로 두고 내부에서 여백을 잡습니다.
   */
  padded?: boolean
  className?: string
}

/** 반투명 오버레이 위에 중앙 정렬된 카드로 내용을 띄웁니다. */
export function Modal({
  open,
  onClose,
  children,
  ariaLabel,
  size = 'md',
  padded = true,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    // 모달이 열려 있는 동안 뒤 화면이 스크롤되지 않도록 막습니다.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-inverse/50 p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal
        aria-label={ariaLabel}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          'flex max-h-full w-full flex-col overflow-hidden rounded-lg bg-bg-surface',
          'shadow-[0_8px_40px_0_rgb(26_29_38/0.28)]',
          SIZE_CLASS[size],
          padded && 'items-center gap-4 p-10',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
