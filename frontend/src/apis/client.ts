import axios from 'axios'

/** 스캔 PDF는 OCR 단계까지 거치므로 응답이 늦게 옵니다. */
const TIMEOUT_MS = 60_000

const NETWORK_ERROR_MESSAGE = '서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요'
const TIMEOUT_ERROR_MESSAGE = '처리 시간이 너무 오래 걸립니다. 잠시 후 다시 시도해주세요'
const UNKNOWN_ERROR_MESSAGE = '알 수 없는 오류가 발생했습니다'

/** FastAPI는 실패 사유를 detail에 담아 보냅니다. */
interface ApiErrorBody {
  detail?: string
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

export const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  timeout: TIMEOUT_MS,
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

    const detail = (response.data as ApiErrorBody | undefined)?.detail
    return Promise.reject(new ApiError(detail || UNKNOWN_ERROR_MESSAGE, response.status))
  },
)
