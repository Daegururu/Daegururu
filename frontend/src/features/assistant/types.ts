/** AI 도우미 화면(05)에서 쓰는 타입입니다. */

import type { ChatBubbleRole } from '@/components/common'

/**
 * AI 말풍선의 상태. 없으면 정상 답변입니다.
 * - pending: 답변을 기다리는 중. 문단 대신 로딩 표시를 보여줍니다.
 * - error: 답변을 받지 못함. 오류 문구와 [다시 보내기]를 보여줍니다.
 */
export type ChatMessageStatus = 'pending' | 'error'

export interface ChatMessage {
  id: string
  role: ChatBubbleRole
  /** 문단 단위로 나눠 둡니다. 말풍선 안에서 줄바꿈으로 이어집니다. */
  paragraphs: string[]
  status?: ChatMessageStatus
  /** error 상태일 때 다시 보낼 원래 질문 */
  question?: string
}
