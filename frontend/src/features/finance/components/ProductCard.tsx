import { Button, StatusChip } from '@/components/common'
import { CATEGORY_LABEL } from '@/features/finance/constants'
import type { FinanceProduct } from '@/features/finance/types'

export interface ProductCardProps {
  product: FinanceProduct
  onViewDetail: (id: number) => void
}

/** 07 상품 카드 한 줄. 로고 · 정보 · 한도/금리/기간 · 상태 칩 + [자세히 보기] 순입니다. */
export function ProductCard({ product, onViewDetail }: ProductCardProps) {
  const { id, name, logoText, provider, category, target, limit, rate, term, status, eligible } =
    product

  const metrics = [
    { label: '한도', value: limit },
    { label: '금리', value: rate },
    { label: '기간', value: term },
  ]

  return (
    <li className="flex items-center gap-6 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
      <span
        aria-hidden
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-body-m font-medium text-text-brand"
      >
        {logoText}
      </span>

      <div className="flex w-[360px] shrink-0 flex-col gap-1.5">
        <h3 className="text-heading-s font-bold text-text-primary">{name}</h3>
        <p className="text-body-s text-text-secondary">
          {provider} · {CATEGORY_LABEL[category]} · {target}
        </p>
      </div>

      <dl className="flex flex-1 gap-8">
        {metrics.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <dd className="text-number-l font-bold whitespace-nowrap text-text-primary">{value}</dd>
            <dt className="text-caption text-text-tertiary">{label}</dt>
          </div>
        ))}
      </dl>

      <div className="flex shrink-0 flex-col items-end gap-2.5">
        <StatusChip tone={eligible ? 'safe' : 'warn'}>{status}</StatusChip>
        <Button onClick={() => onViewDetail(id)}>자세히 보기</Button>
      </div>
    </li>
  )
}
