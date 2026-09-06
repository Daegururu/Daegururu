import { useEffect, useRef, type ReactNode } from 'react'

import { cn } from '@/utils/cn'

const SIZE_CLASS = {
  md: 'max-w-[480px]',
  lg: 'max-w-[640px]',
} as const

/** Tab으로 이동할 수 있는 요소를 고르는 선택자입니다. */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

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
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    // 모달을 열기 직전에 포커스가 있던 요소를 기억했다가 닫을 때 되돌려줍니다.
    const previouslyFocused = document.activeElement as HTMLElement | null

    const getFocusable = () =>
      Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [])

    // 모달 안에 포커스 가능한 요소가 없으면 컨테이너 자체에 포커스를 둡니다.
    const [firstFocusable] = getFocusable()
    ;(firstFocusable ?? dialogRef.current)?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      // Tab이 모달 밖으로 나가지 않도록 처음과 끝을 이어 붙입니다.
      const focusable = getFocusable()
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && (active === first || active === dialogRef.current)) {
        event.preventDefault()
        last.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    // 모달이 열려 있는 동안 뒤 화면이 스크롤되지 않도록 막습니다.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-inverse/50 p-6"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal
        aria-label={ariaLabel}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          'flex max-h-full w-full flex-col overflow-hidden rounded-lg bg-bg-surface',
          'shadow-[0_8px_40px_0_rgb(26_29_38/0.28)] focus:outline-none',
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
