import { useId, type ComponentPropsWithRef } from 'react'

import { cn } from '@/utils/cn'

export interface InputProps extends Omit<ComponentPropsWithRef<'input'>, 'id'> {
  label?: string
  /** 필드 아래 안내 문구. errorMessage가 있으면 그쪽이 우선합니다. */
  helperText?: string
  /** 값이 있으면 에러 상태로 표시되고 helperText 대신 이 문구가 보입니다. */
  errorMessage?: string
}

export function Input({
  label,
  helperText,
  errorMessage,
  className,
  // 아래 두 속성은 {...props}에 섞이면 내부 계산 값을 덮어쓰므로 미리 분리합니다.
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: InputProps) {
  const id = useId()
  const hasError = Boolean(errorMessage)
  // 빈 문자열도 '에러 없음'으로 보고 헬퍼 텍스트를 노출합니다.
  const description = errorMessage || helperText
  const descriptionId = description ? `${id}-description` : undefined
  // 호출한 쪽이 넘긴 설명 id와 내부에서 만든 id를 함께 연결합니다.
  const describedBy = [ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-body-s font-medium text-text-secondary">
          {label}
        </label>
      )}

      <input
        id={id}
        aria-invalid={hasError || ariaInvalid || undefined}
        aria-describedby={describedBy}
        className={cn(
          'h-11 w-full rounded-md border bg-bg-surface px-4',
          'text-body-m text-text-primary placeholder:text-text-tertiary',
          'transition-colors focus:outline-none',
          hasError
            ? 'border-status-danger focus:ring-1 focus:ring-status-danger'
            : 'border-border-default focus:border-border-brand focus:ring-1 focus:ring-border-brand',
          'disabled:cursor-not-allowed disabled:bg-bg-subtle disabled:text-text-tertiary',
          className,
        )}
        {...props}
      />

      {description && (
        <p
          id={descriptionId}
          className={cn('text-caption', hasError ? 'text-status-danger' : 'text-text-secondary')}
        >
          {description}
        </p>
      )}
    </div>
  )
}
