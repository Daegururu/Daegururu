import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'md' | 'sm'

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-brand-primary text-text-inverse hover:bg-brand-hover active:bg-brand-pressed',
  secondary:
    'border border-border-default bg-bg-surface text-text-primary hover:bg-bg-subtle active:bg-bg-subtle',
  ghost: 'text-text-brand hover:bg-brand-subtle active:bg-brand-subtle',
  danger:
    'bg-status-danger text-text-inverse hover:bg-status-danger-hover active:bg-status-danger-hover',
}

const SIZE_CLASS: Record<ButtonSize, string> = {
  md: 'h-11 px-5 text-body-m',
  sm: 'h-9 px-4 text-body-s',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-md font-medium whitespace-nowrap',
        'transition-colors focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-40',
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className,
      )}
      {...props}
    />
  )
}
