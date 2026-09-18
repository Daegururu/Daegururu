import { client } from '@/apis/client'
import type { AuthResponse, LoginRequest, SignupRequest, SignupResponse } from '@/types/auth'

/** 회원가입. 성공하면 인증 쿠키가 함께 내려와 바로 로그인 상태가 됩니다. 중복 가입은 409입니다. */
export async function postSignup(body: SignupRequest): Promise<SignupResponse> {
  const { data } = await client.post<SignupResponse>('/auth/signup', body)
  return data
}

/** 로그인. 번호·비밀번호가 틀리면 어느 쪽인지 구분하지 않는 401 문구가 옵니다. */
export async function postLogin(body: LoginRequest): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/auth/login', body)
  return data
}

/** 로그아웃. 서버가 인증 쿠키를 지웁니다. 응답은 204입니다. */
export async function postLogout(): Promise<void> {
  await client.post('/auth/logout')
}
