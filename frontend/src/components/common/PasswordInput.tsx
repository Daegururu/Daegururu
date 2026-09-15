import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Input, type InputProps } from '@/components/common/Input'

export type PasswordInputProps = Omit<InputProps, 'type' | 'trailing'>

/** 오른쪽 끝 눈 아이콘으로 입력값을 드러내거나 감출 수 있는 비밀번호 입력칸입니다. */
export function PasswordInput({ disabled, ...props }: PasswordInputProps) {
  const [isVisible, setVisible] = useState(false)

  return (
    <Input
      type={isVisible ? 'text' : 'password'}
      disabled={disabled}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          disabled={disabled}
          aria-label={isVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
          aria-pressed={isVisible}
          className="flex size-6 items-center justify-center rounded-sm text-text-tertiary transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:outline-none disabled:cursor-not-allowed disabled:hover:text-text-tertiary"
        >
          {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      }
      {...props}
    />
  )
}
