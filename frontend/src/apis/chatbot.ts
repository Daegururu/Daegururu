import { client } from '@/apis/client'
import type { ChatReplyResponse } from '@/types/chatbot'
import type { Envelope } from '@/types/envelope'

/**
 * AI 도우미에게 질문을 보내고 답변을 받습니다. 대화 이력은 서버에 남지 않습니다.
 * message는 1~500자. 답변 생성에 실패하면 500(CHAT5000)입니다.
 */
export async function sendChatMessage(message: string): Promise<ChatReplyResponse> {
  const { data } = await client.post<Envelope<ChatReplyResponse>>('/chatbot/messages', { message })
  return data.result
}
