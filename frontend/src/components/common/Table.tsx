import type { ReactNode } from 'react'

import { TABLE_COLUMNS } from '@/constants/table'
import { cn } from '@/utils/cn'

/** 거래 내역 표는 5열 고정입니다: 거래일자 / 구분 / 내용 / 금액 / 정산상태 */
const CELL_CLASS = [
  'w-[130px] shrink-0',
  'w-[130px] shrink-0',
  'min-w-0 flex-1',
  'w-[160px] shrink-0 text-right',
  'w-[120px] shrink-0',
] as const

const ROW_CLASS = 'flex h-13 items-center gap-4 border-b border-border-default px-5'

export interface TableHeaderProps {
  labels?: readonly ReactNode[]
  className?: string
}

export function TableHeader({ labels = TABLE_COLUMNS, className }: TableHeaderProps) {
  return (
    <div
      role="row"
      className={cn(
        ROW_CLASS,
        'bg-bg-subtle text-body-m font-medium text-text-secondary',
        className,
      )}
    >
      {labels.map((label, index) => (
        <span key={index} role="columnheader" className={CELL_CLASS[index]}>
          {label}
        </span>
      ))}
    </div>
  )
}

export interface TableRowProps {
  cells: readonly ReactNode[]
  onClick?: () => void
  className?: string
}

export function TableRow({ cells, onClick, className }: TableRowProps) {
  return (
    <div
      role="row"
      onClick={onClick}
      className={cn(
        ROW_CLASS,
        'bg-bg-surface text-body-m text-text-primary transition-colors hover:bg-bg-subtle',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {cells.map((cell, index) => (
        <span key={index} role="cell" className={CELL_CLASS[index]}>
          {cell}
        </span>
      ))}
    </div>
  )
}
