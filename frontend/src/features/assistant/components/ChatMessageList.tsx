import { Button, ChatBubble } from '@/components/common'
import type { ChatMessage } from '@/features/assistant/types'

export interface ChatMessageListProps {
  messages: ChatMessage[]
  /** 실패한 AI 말풍선의 [다시 보내기]를 눌렀을 때 */
  onRetry: (id: string) => void
}

/** 대화 말풍선 목록입니다. AI는 왼쪽, 사용자는 오른쪽에 붙습니다. */
export function ChatMessageList({ messages, onRetry }: ChatMessageListProps) {
  return (
    <ol className="flex flex-col gap-4">
      {messages.map(({ id, role, paragraphs, status }) => (
        <li key={id} className="flex">
          {status === 'pending' ? (
            <ChatBubble role={role}>
              <TypingDots />
            </ChatBubble>
          ) : status === 'error' ? (
            <ChatBubble role={role} className="flex flex-col items-start gap-2">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-status-danger">
                  {paragraph}
                </p>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={() => onRetry(id)}>
                다시 보내기
              </Button>
            </ChatBubble>
          ) : (
            <ChatBubble role={role}>
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </ChatBubble>
          )}
        </li>
      ))}
    </ol>
  )
}

/** 답변 대기 중 말풍선 안에 보여주는 점 세 개입니다. */
function TypingDots() {
  return (
    <span className="flex h-6 items-center gap-1" role="status" aria-label="답변을 기다리는 중">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="size-2 animate-bounce rounded-full bg-text-tertiary"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}
