import { useEffect, type ReactNode } from 'react'

import { cn } from '@/utils/cn'

export interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  /** 스크린 리더가 읽을 모달 제목 */
  ariaLabel?: string
  className?: string
}

/** 반투명 오버레이 위에 중앙 정렬된 카드로 내용을 띄웁니다. */
export function Modal({ open, onClose, children, ariaLabel, className }: ModalProps) {
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
          'flex w-full max-w-[480px] flex-col items-center gap-4 rounded-lg bg-bg-surface p-10',
          'shadow-[0_8px_40px_0_rgb(26_29_38/0.28)]',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
