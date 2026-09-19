/** POST /chatbot/messages 응답. 답변을 문단 단위로 잘라서 옵니다. */
export interface ChatReplyResponse {
  paragraphs: string[]
}
