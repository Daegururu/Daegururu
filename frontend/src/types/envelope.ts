/**
 * 팀 공통 envelope 응답. dashboard처럼 result에 본문을 담아 보내는 엔드포인트가 씁니다.
 * 실패는 non-2xx로 오므로 성공 응답에서는 result만 꺼내 쓰면 됩니다.
 */
export interface Envelope<T> {
  isSuccess: boolean
  /** 예: "DASH2000" */
  code: string
  message: string
  result: T
  error: { code: string; message: string } | null
}
