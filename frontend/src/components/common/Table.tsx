import type { ReactNode } from 'react'

import { TABLE_COLUMNS } from '@/constants/table'
import { cn } from '@/utils/cn'

/** 거래 내역 표는 5열 고정입니다: 거래일자 / 구분 / 내용 / 금액 / 정산상태 */
const CELL_CLASS = [
  'w-[130px] shrink-0',
  'w-[130px] shrink-0',
  'min-w-0 flex-1',
  // 금액은 우측 정렬이라 오른쪽 여백을 주면 숫자만 왼쪽으로 밀립니다.
  'w-[160px] shrink-0 pr-10 text-right',
  'w-[120px] shrink-0',
] as const

const ROW_CLASS = 'flex h-13 items-center gap-4 border-b border-border-default px-5'

/** CELL_CLASS와 개수를 맞추기 위해 정확히 5개만 허용합니다. */
export type TableCells = readonly [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode]

export interface TableHeaderProps {
  labels?: TableCells
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
  cells: TableCells
  className?: string
}

// 거래 내역 표는 읽기 전용입니다. 거래 추가·수정은 모달 폼에서 처리합니다.
export function TableRow({ cells, className }: TableRowProps) {
  return (
    <div
      role="row"
      className={cn(
        ROW_CLASS,
        'bg-bg-surface text-body-m text-text-primary transition-colors hover:bg-bg-subtle',
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
