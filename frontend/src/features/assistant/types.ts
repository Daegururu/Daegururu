/** AI 도우미 화면(05)에서 쓰는 타입입니다. API 연동 전까지는 mockData가 이 형태를 채웁니다. */

import type { ChatBubbleRole } from '@/components/common'

export interface ChatMessage {
  id: string
  role: ChatBubbleRole
  /** 문단 단위로 나눠 둡니다. 말풍선 안에서 줄바꿈으로 이어집니다. */
  paragraphs: string[]
}
