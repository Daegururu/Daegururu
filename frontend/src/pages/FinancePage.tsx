import { useState } from 'react'
import { useNavigate } from 'react-router'

import { StatusCard } from '@/components/common'
import { AppLayout } from '@/components/layout'
import { CategoryFilterChips } from '@/features/finance/components/CategoryFilterChips'
import { ProductCard } from '@/features/finance/components/ProductCard'
import type { CategoryFilter } from '@/features/finance/constants'
import { useFinanceProducts } from '@/features/finance/hooks/useFinance'
import { financeDetailPath } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/utils/cn'

/** 07 금융상품 추천. 홈 추천 지원사업의 [전체 보기]도 이 화면으로 들어옵니다. */
export function FinancePage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const userLabel = user ? `${user.representativeName} 사장님` : ''
  const [category, setCategory] = useState<CategoryFilter>('all')

  // 분류는 서버 쿼리로 넘깁니다. 신청 가능한 상품이 앞에 오도록 정렬도 서버가 합니다.
  const products = useFinanceProducts(category)

  const renderList = () => {
    if (products.isPending) {
      return <StatusCard loading loadingMessage="추천 상품을 불러오는 중이에요..." />
    }
    if (products.isError) {
      return <StatusCard errorMessage={products.error.message} onRetry={() => products.refetch()} />
    }
    if (products.data.products.length === 0) {
      return (
        <p className="rounded-lg border border-border-default bg-bg-surface px-6 py-10 text-center text-body-m text-text-secondary shadow-sm">
          지금 조건에 맞는 상품이 없습니다. 다른 분류를 골라보세요.
        </p>
      )
    }
    return (
      // 분류를 바꿔 새 목록을 받는 동안은 이전 목록을 흐리게 둡니다.
      <ul className={cn('flex flex-col gap-6', products.isPlaceholderData && 'opacity-50')}>
        {products.data.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetail={(id) => navigate(financeDetailPath(String(id)))}
          />
        ))}
      </ul>
    )
  }

  const banner = products.data?.matchBanner

  return (
    <AppLayout title="금융 지원" user={userLabel}>
      {/* 가게 정보가 없으면 배너도 없습니다(matchBanner: null). */}
      {banner && (
        <div className="flex flex-col gap-1.5 rounded-lg bg-brand-subtle px-6 py-5">
          <p className="text-heading-s font-bold text-text-brand">{banner.title}</p>
          <p className="text-body-m text-text-secondary">{banner.description}</p>
        </div>
      )}

      <CategoryFilterChips value={category} onChange={setCategory} />

      {renderList()}
    </AppLayout>
  )
}
