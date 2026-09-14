import { client } from '@/apis/client'
import type { AuthResponse, LoginRequest, SignupRequest } from '@/types/auth'

/** 회원가입. 성공하면 바로 쓸 수 있는 access_token이 함께 옵니다. 중복 가입은 409입니다. */
export async function postSignup(body: SignupRequest): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/auth/signup', body)
  return data
}

/** 로그인. 번호·비밀번호가 틀리면 어느 쪽인지 구분하지 않는 401 문구가 옵니다. */
export async function postLogin(body: LoginRequest): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/auth/login', body)
  return data
}
