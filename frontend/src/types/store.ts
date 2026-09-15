/** POST /api/v1/stores · GET /api/v1/stores/me 요청·응답. */

export interface StoreCreateRequest {
  business_name: string
  industry_name: string
  business_address: string
  /** 개업일 YYYY-MM-DD */
  open_date: string
}

export interface StoreResponse {
  store_id: number
  business_name: string
  industry_name: string
  business_address: string
  open_date: string
}

export interface StoreDetailResponse {
  business_name: string
  industry_name: string
  business_address: string
  open_date: string
  /** 서버가 계산한 사업기간. 예: "3년 2개월" */
  business_period: string
}
