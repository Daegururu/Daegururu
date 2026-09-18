import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getExternalProgram, getFinanceProduct, getFinanceProducts } from '@/apis/finance'

import type { CategoryFilter } from '../constants'
import { toExternalProgram, toExternalProgramDetail, toProduct, toProductDetail } from '../mapping'

const FINANCE_KEY = ['finance'] as const

/** 추천 상품 목록. 분류 칩을 바꾸는 동안 이전 목록을 유지해 깜빡이지 않게 합니다. */
export function useFinanceProducts(category: CategoryFilter) {
  return useQuery({
    queryKey: [...FINANCE_KEY, 'products', category],
    queryFn: () => getFinanceProducts(category === 'all' ? undefined : category),
    select: (data) => ({
      matchBanner: data.matchBanner,
      products: data.products.map(toProduct),
      externalPrograms: data.externalPrograms.map(toExternalProgram),
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

/** 지원사업 공고 상세. id가 null(잘못된 경로)이면 부르지 않습니다. */
export function useExternalProgram(programId: number | null) {
  return useQuery({
    queryKey: [...FINANCE_KEY, 'external-program', programId],
    queryFn: () => getExternalProgram(programId!),
    select: toExternalProgramDetail,
    enabled: programId !== null,
  })
}
