import { TableHeader, TableRow } from '@/components/common'
import { SETTLEMENT_LABEL } from '@/features/sales/mockData'
import type { Transaction } from '@/features/sales/types'
import { cn } from '@/utils/cn'
import { formatWon } from '@/utils/format'

export interface TransactionTableProps {
  transactions: Transaction[]
}

/** 거래 내역 표입니다. 짝수 행은 연한 배경으로 구분합니다(Figma 06). */
export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div
      role="table"
      className="overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-sm"
    >
      <TableHeader />

      {transactions.length === 0 ? (
        <p className="px-5 py-10 text-center text-body-m text-text-secondary">
          조건에 맞는 거래가 없습니다
        </p>
      ) : (
        transactions.map(({ id, date, method, content, amount, settlement }, index) => (
          <TableRow
            key={id}
            cells={[date, method, content, formatWon(amount), SETTLEMENT_LABEL[settlement]]}
            className={cn('last:border-b-0', index % 2 === 1 && 'bg-bg-subtle')}
          />
        ))
      )}
    </div>
  )
}
