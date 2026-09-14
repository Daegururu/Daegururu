import type { SalesSummaryItem } from '@/features/sales/types'

export interface SalesSummaryCardsProps {
  items: SalesSummaryItem[]
}

/** 총매출 / 수수료 / 실정산액 요약 3열입니다. */
export function SalesSummaryCards({ items }: SalesSummaryCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {items.map(({ label, value, caption }) => (
        <div
          key={label}
          className="flex flex-col gap-1.5 rounded-lg border border-border-default bg-bg-surface px-6 py-5 shadow-sm"
        >
          <p className="text-body-m text-text-secondary">{label}</p>
          <p className="text-number-l font-bold text-text-primary">{value}</p>
          <p className="text-caption text-text-tertiary">{caption}</p>
        </div>
      ))}
    </div>
  )
}
