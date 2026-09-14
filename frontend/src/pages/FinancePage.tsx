import { useState } from 'react'
import { useNavigate } from 'react-router'

import { AppLayout } from '@/components/layout'
import { CategoryFilterChips } from '@/features/finance/components/CategoryFilterChips'
import { ProductCard } from '@/features/finance/components/ProductCard'
import {
  MOCK_MATCH_BANNER,
  MOCK_PRODUCTS,
  MOCK_USER,
  type CategoryFilter,
} from '@/features/finance/mockData'
import { financeDetailPath } from '@/routes/paths'

/** 07 금융상품 추천. 홈 추천 지원사업의 [전체 보기]도 이 화면으로 들어옵니다. */
export function FinancePage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<CategoryFilter>('all')

  // TODO: 추천 상품 API 연동. 지금은 전부 목데이터입니다.
  const products = MOCK_PRODUCTS.filter(
    (product) => category === 'all' || product.category === category,
  )

  return (
    <AppLayout title="금융 지원" user={MOCK_USER}>
      <div className="flex flex-col gap-1.5 rounded-lg bg-brand-subtle px-6 py-5">
        <p className="text-heading-s font-bold text-text-brand">{MOCK_MATCH_BANNER.title}</p>
        <p className="text-body-m text-text-secondary">{MOCK_MATCH_BANNER.description}</p>
      </div>

      <CategoryFilterChips value={category} onChange={setCategory} />

      {products.length === 0 ? (
        <p className="rounded-lg border border-border-default bg-bg-surface px-6 py-10 text-center text-body-m text-text-secondary shadow-sm">
          지금 조건에 맞는 상품이 없습니다. 다른 분류를 골라보세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetail={(id) => navigate(financeDetailPath(id))}
            />
          ))}
        </ul>
      )}
    </AppLayout>
  )
}
