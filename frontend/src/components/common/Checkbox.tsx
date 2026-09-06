import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/utils/cn'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  children?: ReactNode
  /** 라벨을 굵게 표시합니다. 약관 '전체 동의' 같은 대표 항목에 사용합니다. */
  emphasized?: boolean
}

export function Checkbox({ children, emphasized = false, className, ...props }: CheckboxProps) {
  const id = useId()

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* 네이티브 input은 화면에서 숨기되 포커스와 키보드 조작은 그대로 유지합니다. */}
      <input id={id} type="checkbox" className="peer sr-only" {...props} />
      <label
        htmlFor={id}
        aria-hidden
        className={cn(
          'flex size-[18px] shrink-0 cursor-pointer items-center justify-center rounded-sm',
          'border border-border-strong bg-bg-surface text-caption font-bold',
          // 체크 표시는 항상 렌더링하고 색으로만 노출합니다. peer 변형은 형제 요소에만 걸립니다.
          'text-transparent peer-checked:text-text-inverse',
          'peer-checked:border-brand-primary peer-checked:bg-brand-primary',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-border-brand',
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-40',
        )}
      >
        ✓
      </label>
      {children && (
        <label
          htmlFor={id}
          className={cn(
            'cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-40',
            emphasized
              ? 'text-body-m font-medium text-text-primary'
              : 'text-body-s text-text-secondary',
          )}
        >
          {children}
        </label>
      )}
    </div>
  )
}
