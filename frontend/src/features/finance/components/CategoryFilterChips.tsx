import { CATEGORY_FILTERS, type CategoryFilter } from '@/features/finance/mockData'
import { cn } from '@/utils/cn'

export interface CategoryFilterChipsProps {
  value: CategoryFilter
  onChange: (value: CategoryFilter) => void
}

/** 07 필터 칩 4개. 하나만 고를 수 있어 라디오 그룹으로 둡니다. */
export function CategoryFilterChips({ value, onChange }: CategoryFilterChipsProps) {
  return (
    <div role="radiogroup" aria-label="상품 분류" className="flex flex-wrap gap-2">
      {CATEGORY_FILTERS.map((filter) => {
        const active = filter.value === value

        return (
          <button
            key={filter.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(filter.value)}
            className={cn(
              'rounded-full border px-4 py-2 text-body-m whitespace-nowrap transition-colors',
              active
                ? 'border-brand-primary bg-brand-primary font-medium text-text-inverse'
                : 'border-border-default bg-bg-surface text-text-secondary hover:bg-bg-subtle',
            )}
          >
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}
