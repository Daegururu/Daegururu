import { useState } from 'react'
import { useNavigate } from 'react-router'

import { StatusCard } from '@/components/common'
import { AppLayout } from '@/components/layout'
import { CategoryFilterChips } from '@/features/finance/components/CategoryFilterChips'
import { ExternalProgramCard } from '@/features/finance/components/ExternalProgramCard'
import { ProductCard } from '@/features/finance/components/ProductCard'
import type { CategoryFilter } from '@/features/finance/constants'
import { useFinanceProducts } from '@/features/finance/hooks/useFinance'
import { financeDetailPath, financeProgramPath } from '@/routes/paths'
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

  // 기업마당 공고는 분류 필터와 무관하게 항상 같은 목록입니다. 목록 응답에 같이 옵니다.
  const renderPrograms = () => {
    if (products.isPending || products.isError) return null
    const programs = products.data.externalPrograms
    return (
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-heading-s font-bold text-text-primary">지원사업 공고</h2>
          <p className="text-body-s text-text-secondary">
            기업마당에 올라온 공고입니다. 신청은 원문 사이트에서 진행됩니다.
          </p>
        </div>
        {programs.length === 0 ? (
          <p className="rounded-lg border border-border-default bg-bg-surface px-6 py-10 text-center text-body-m text-text-secondary shadow-sm">
            지금 신청할 수 있는 공고가 없습니다.
          </p>
        ) : (
          <ul className="flex flex-col gap-6">
            {programs.map((program) => (
              <ExternalProgramCard
                key={program.id}
                program={program}
                onViewDetail={(id) => navigate(financeProgramPath(String(id)))}
              />
            ))}
          </ul>
        )}
      </section>
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

      {renderPrograms()}
    </AppLayout>
  )
}
