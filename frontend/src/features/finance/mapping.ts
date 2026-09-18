import type {
  ExternalProgramDetailResponse,
  ExternalProgramResponse,
  FinanceProductDetailResponse,
  FinanceProductResponse,
} from '@/types/finance'

import { SOURCE_LABEL } from './constants'
import type {
  ExternalProgram,
  ExternalProgramDetail,
  FinanceProduct,
  FinanceProductDetail,
  ProductCategory,
} from './types'

const CATEGORIES: readonly ProductCategory[] = ['operating', 'facility', 'policy']

/** 모르는 분류는 운영자금으로 둡니다. 필터 칩엔 안 걸리지만 카드는 그려집니다. */
function toCategory(value: string): ProductCategory {
  return (CATEGORIES as readonly string[]).includes(value)
    ? (value as ProductCategory)
    : 'operating'
}

/** 상품 카드(07)에 쓰는 형태로 바꿉니다. 문구는 서버가 만든 걸 그대로 씁니다. */
export function toProduct(response: FinanceProductResponse): FinanceProduct {
  return {
    id: response.productId,
    name: response.name,
    logoText: response.logoText,
    provider: response.provider,
    category: toCategory(response.category),
    target: response.target,
    limit: response.limit,
    rate: response.rate,
    term: response.term,
    status: response.status,
    // 서버는 문구만 주므로 문구로 판별합니다. 상세는 eligibility.met으로 다시 계산합니다.
    eligible: response.status === '신청 가능',
  }
}

/** 상품 상세(08)에 쓰는 형태로 바꿉니다. */
export function toProductDetail(response: FinanceProductDetailResponse): FinanceProductDetail {
  const eligibility = response.eligibility.map(({ condition, evidence, met }) => ({
    condition,
    evidence,
    met,
  }))

  return {
    ...toProduct(response),
    eligible: eligibility.every(({ met }) => met),
    overview: response.overview,
    termDetail: response.termDetail,
    eligibility,
    documents: response.documents,
    summary: response.summary,
    diagnosisNote: response.diagnosisNote,
  }
}

/** 지원사업 공고 카드(07)에 쓰는 형태로 바꿉니다. */
export function toExternalProgram(response: ExternalProgramResponse): ExternalProgram {
  return {
    id: response.programId,
    title: response.title,
    agency: response.agency,
    target: response.target,
    applyPeriod: response.applyPeriod ?? '상시',
    detailUrl: response.detailUrl,
    sourceLabel: SOURCE_LABEL[response.source] ?? response.source,
  }
}

/** 지원사업 공고 상세에 쓰는 형태로 바꿉니다. 요약은 줄바꿈으로 문단을 나눕니다. */
export function toExternalProgramDetail(
  response: ExternalProgramDetailResponse,
): ExternalProgramDetail {
  return {
    ...toExternalProgram(response),
    category: response.category,
    summaryParagraphs: response.summary
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
  }
}

/** URL 파라미터 id를 숫자 id로 바꿉니다. 숫자가 아니거나 안전하게 표현할 수 없을 만큼 크면 null입니다. */
export function parseProductId(value: string): number | null {
  if (!/^\d+$/.test(value)) return null
  const id = Number(value)
  return Number.isSafeInteger(id) ? id : null
}
