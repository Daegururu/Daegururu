import axios from 'axios'

import { useAuthStore } from '@/stores/authStore'

/** 스캔 PDF는 OCR 단계까지 거치므로 응답이 늦게 옵니다. */
const TIMEOUT_MS = 60_000

const NETWORK_ERROR_MESSAGE = '서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요'
const TIMEOUT_ERROR_MESSAGE = '처리 시간이 너무 오래 걸립니다. 잠시 후 다시 시도해주세요'
const UNKNOWN_ERROR_MESSAGE = '알 수 없는 오류가 발생했습니다'
const SESSION_EXPIRED_MESSAGE = '로그인이 만료되었습니다. 다시 로그인해주세요'

/**
 * 백엔드 오류 응답은 엔드포인트마다 다릅니다.
 * - auth·stores·certificates: FastAPI 기본 `{ detail }`. 422는 detail이 배열입니다.
 * - dashboard·인증 실패(AUTH4010): 팀 공통 envelope `{ isSuccess, code, message, result, error }`
 * 어느 쪽이든 화면에 보여줄 문구 하나로 좁힙니다.
 */
interface ApiErrorBody {
  detail?: string | { msg: string }[]
  message?: string
  code?: string
}

/** 화면에서 message를 그대로 보여줄 수 있는 형태로 정리한 API 오류입니다. */
export class ApiError extends Error {
  /** 응답을 받지 못했으면(네트워크 오류·타임아웃) undefined입니다. */
  status: number | undefined

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function extractMessage(body: ApiErrorBody | undefined): string {
  if (!body) return UNKNOWN_ERROR_MESSAGE
  if (typeof body.detail === 'string') return body.detail
  if (Array.isArray(body.detail)) return body.detail.map((item) => item.msg).join('\n')
  return body.message || UNKNOWN_ERROR_MESSAGE
}

// 값이 없으면 baseURL이 undefined로 들어가 프론트 오리진으로 요청이 나갑니다.
// 조용히 404를 받는 대신 앱을 켤 때 바로 알 수 있도록 여기서 막습니다.
const baseUrl = import.meta.env.VITE_API_BASE_URL
if (!baseUrl) {
  throw new Error('VITE_API_BASE_URL이 설정되지 않았습니다. .env를 확인해주세요')
}

export const client = axios.create({
  // 개발 서버에서는 vite 프록시(/api → VITE_API_BASE_URL)를 거칩니다. vite.config.ts 참고.
  baseURL: import.meta.env.DEV ? '/api/v1' : `${baseUrl}/api/v1`,
  timeout: TIMEOUT_MS,
  // 인증은 서버가 내려주는 HttpOnly 쿠키입니다. 다른 오리진(api.daegururu.cloud)에도 쿠키가
  // 오가도록 켭니다. 토큰을 프론트가 들고 있지 않아 헤더에 붙일 것은 없습니다.
  withCredentials: true,
})

// 호출하는 쪽이 axios 오류 구조를 몰라도 되도록 ApiError 하나로 좁힙니다.
client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(new ApiError(UNKNOWN_ERROR_MESSAGE))
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return Promise.reject(new ApiError(TIMEOUT_ERROR_MESSAGE))
    }

    const response = error.response
    if (!response) {
      return Promise.reject(new ApiError(NETWORK_ERROR_MESSAGE))
    }

    // 로그인한 상태에서 401이면 쿠키가 만료된 것입니다. 유저 정보를 지우면 RequireAuth가
    // 로그인으로 보냅니다. 로그인 실패(로그인 전 401)는 화면이 직접 문구를 보여줍니다.
    if (response.status === 401 && useAuthStore.getState().user) {
      useAuthStore.getState().clearAuth()
      return Promise.reject(new ApiError(SESSION_EXPIRED_MESSAGE, 401))
    }

    return Promise.reject(new ApiError(extractMessage(response.data), response.status))
  },
)
