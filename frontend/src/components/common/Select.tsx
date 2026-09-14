import { useEffect, useId, useRef, useState } from 'react'

import { cn } from '@/utils/cn'

export interface SelectOption<T extends string> {
  value: T
  label: string
}

export interface SelectProps<T extends string> {
  value: T
  options: readonly SelectOption<T>[]
  onChange: (value: T) => void
  /** 라벨. 있으면 입력칸 위에 표시됩니다. */
  label?: string
  /** 스크린 리더용 이름. label이 없을 때 넘깁니다. */
  ariaLabel?: string
  /** 입력칸 너비를 부모에 맞춥니다. 모달 폼처럼 한 줄을 다 쓰는 곳에서 켭니다. */
  fullWidth?: boolean
  className?: string
}

/**
 * 드롭다운 셀렉트입니다. 열림·닫힘은 내부 상태로만 관리하고 별도 화면을 만들지 않습니다.
 * 선택된 항목은 브랜드 틴트 배경으로 강조합니다(Figma 06d).
 */
export function Select<T extends string>({
  value,
  options,
  onChange,
  label,
  ariaLabel,
  fullWidth = false,
  className,
}: SelectProps<T>) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [isOpen, setOpen] = useState(false)

  const selected = options.find((option) => option.value === value)

  // 바깥을 누르거나 ESC를 누르면 닫습니다.
  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (next: T) => {
    onChange(next)
    setOpen(false)
  }

  return (
    <div
      ref={rootRef}
      className={cn('relative flex flex-col gap-2', fullWidth ? 'w-full' : 'w-fit', className)}
    >
      {label && (
        <label htmlFor={id} className="text-body-s font-medium text-text-secondary">
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-11 items-center justify-between gap-3 rounded-md border bg-bg-surface px-3.5',
          'text-body-m text-text-primary transition-colors focus:outline-none',
          isOpen
            ? 'border-border-brand ring-1 ring-border-brand'
            : 'border-border-default hover:bg-bg-subtle',
          fullWidth ? 'w-full' : 'w-fit',
        )}
      >
        <span className="truncate">{selected?.label}</span>
        <span aria-hidden className="text-caption text-text-tertiary">
          ▾
        </span>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-labelledby={label ? id : undefined}
          className={cn(
            'absolute top-full left-0 z-20 mt-1 flex min-w-full flex-col gap-0.5 rounded-md border border-border-default bg-bg-surface p-1.5',
            'shadow-[0_4px_16px_0_rgb(26_28_38/0.16)]',
          )}
        >
          {options.map((option) => {
            const active = option.value === value

            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'flex h-9 w-full items-center rounded-sm px-3 text-left text-body-m whitespace-nowrap transition-colors',
                    active
                      ? 'bg-brand-subtle font-medium text-text-brand'
                      : 'text-text-primary hover:bg-bg-subtle',
                  )}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
