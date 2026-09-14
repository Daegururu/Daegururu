import { client } from '@/apis/client'
import type { StoreCreateRequest, StoreDetailResponse, StoreResponse } from '@/types/store'

/** 가게 정보 등록. 한 계정에 가게 하나라 이미 있으면 409입니다. */
export async function postStore(body: StoreCreateRequest): Promise<StoreResponse> {
  const { data } = await client.post<StoreResponse>('/stores', body)
  return data
}

/** 내 가게 정보 조회. 등록 전이면 404입니다. */
export async function getMyStore(): Promise<StoreDetailResponse> {
  const { data } = await client.get<StoreDetailResponse>('/stores/me')
  return data
}
