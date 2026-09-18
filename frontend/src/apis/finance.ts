import { client } from '@/apis/client'
import type { Envelope } from '@/types/envelope'
import type {
  ExternalProgramDetailResponse,
  FinanceProductDetailResponse,
  FinanceProductListResponse,
} from '@/types/finance'

/** 추천 상품 목록. category를 안 넘기면 전체입니다. */
export async function getFinanceProducts(category?: string): Promise<FinanceProductListResponse> {
  const { data } = await client.get<Envelope<FinanceProductListResponse>>('/finance/products', {
    params: category ? { category } : undefined,
  })
  return data.result
}

/** 상품 상세. 없는 id면 404(FIN4040)입니다. */
export async function getFinanceProduct(productId: number): Promise<FinanceProductDetailResponse> {
  const { data } = await client.get<Envelope<FinanceProductDetailResponse>>(
    `/finance/products/${productId}`,
  )
  return data.result
}

/** 지원사업 공고 상세. 없는 id면 404(FIN4041)입니다. */
export async function getExternalProgram(
  programId: number,
): Promise<ExternalProgramDetailResponse> {
  const { data } = await client.get<Envelope<ExternalProgramDetailResponse>>(
    `/finance/external-programs/${programId}`,
  )
  return data.result
}
