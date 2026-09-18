/**
 * GET /api/v1/mypage · PATCH /mypage/store · PATCH /mypage/password · DELETE /mypage/account 요청·응답.
 * mypage는 envelope 없이 response_model 그대로(snake_case) 내려오고, 실패는 `{ detail }`입니다.
 */

export interface MypageStoreResponse {
  business_name: string
  industry_name: string
  business_address: string
  /** 개업일 YYYY-MM-DD */
  open_date: string
  /** 업태. 백엔드 추가 예정이라 없을 수 있습니다. */
  business_type?: string
  /** 종목. 백엔드 추가 예정이라 없을 수 있습니다. */
  business_category?: string
}

export interface MypageVerificationResponse {
  /** 하이픈 없는 10자리 */
  business_reg_no: string
  representative_name: string
  industry_name: string
  business_type?: string
  business_category?: string
}

export interface MypageAccountResponse {
  /** 로그인 아이디. 사업자등록번호와 같습니다. */
  login_id: string
  /** 하이픈 없는 11자리 */
  phone_number: string
}

export interface MypageResponse {
  store: MypageStoreResponse
  business_verification: MypageVerificationResponse
  account: MypageAccountResponse
}

export interface StoreUpdateRequest {
  business_name: string
  industry_name: string
  business_address: string
  open_date: string
  business_type?: string
  business_category?: string
}

export interface StoreUpdateResponse {
  message: string
  store: MypageStoreResponse
}

export interface PasswordChangeRequest {
  current_password: string
  new_password: string
}

export interface AccountDeleteRequest {
  password: string
}
