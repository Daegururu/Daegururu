/**
 * POST /api/v1/auth/signup · /api/v1/auth/login 요청·응답.
 * auth·stores는 envelope 없이 response_model 그대로(snake_case) 내려옵니다.
 */

export interface SignupRequest {
  /** 하이픈을 뺀 사업자등록번호 10자리 */
  business_reg_no: string
  representative_name: string
  password: string
}

export interface LoginRequest {
  business_reg_no: string
  password: string
}

/** 회원가입과 로그인 응답 형태가 같습니다. */
export interface AuthResponse {
  user_id: number
  business_reg_no: string
  representative_name: string
  access_token: string
  token_type: 'bearer'
}
