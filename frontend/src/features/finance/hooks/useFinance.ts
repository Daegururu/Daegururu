import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getFinanceProduct, getFinanceProducts } from '@/apis/finance'

import type { CategoryFilter } from '../constants'
import { toProduct, toProductDetail } from '../mapping'

const FINANCE_KEY = ['finance'] as const

/** 추천 상품 목록. 분류 칩을 바꾸는 동안 이전 목록을 유지해 깜빡이지 않게 합니다. */
export function useFinanceProducts(category: CategoryFilter) {
  return useQuery({
    queryKey: [...FINANCE_KEY, 'products', category],
    queryFn: () => getFinanceProducts(category === 'all' ? undefined : category),
    select: (data) => ({
      matchBanner: data.matchBanner,
      products: data.products.map(toProduct),
    }),
    placeholderData: keepPreviousData,
  })
}

/** 상품 상세. id가 null(잘못된 경로)이면 부르지 않습니다. */
export function useFinanceProduct(productId: number | null) {
  return useQuery({
    queryKey: [...FINANCE_KEY, 'product', productId],
    queryFn: () => getFinanceProduct(productId!),
    select: toProductDetail,
    enabled: productId !== null,
  })
}
