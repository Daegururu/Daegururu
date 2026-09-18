/**
 * POST /api/v1/auth/signup · /api/v1/auth/login 요청·응답.
 * auth·stores는 envelope 없이 response_model 그대로(snake_case) 내려옵니다.
 */

export interface SignupRequest {
  /** 하이픈을 뺀 사업자등록번호 10자리 */
  business_reg_no: string
  representative_name: string
  /** 하이픈을 뺀 휴대폰 번호 11자리 */
  phone_number: string
  password: string
}

export interface LoginRequest {
  business_reg_no: string
  password: string
}

/**
 * 회원가입과 로그인 응답. 토큰은 본문에 오지 않고 HttpOnly 쿠키(access_token)로 내려옵니다.
 * 회원가입 응답에만 phone_number가 더 있습니다.
 */
export interface AuthResponse {
  user_id: number
  business_reg_no: string
  representative_name: string
}

export interface SignupResponse extends AuthResponse {
  phone_number: string
}
