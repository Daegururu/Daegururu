import { useEffect, useRef } from 'react'

import { ChatBubble } from '@/components/common'
import type { ChatMessage } from '@/features/assistant/types'

export interface ChatMessageListProps {
  messages: ChatMessage[]
}

/** 대화 말풍선 목록입니다. AI는 왼쪽, 사용자는 오른쪽에 붙습니다. */
export function ChatMessageList({ messages }: ChatMessageListProps) {
  const endRef = useRef<HTMLDivElement>(null)

  // 새 메시지가 붙으면 마지막 말풍선이 보이도록 내립니다.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [messages.length])

  return (
    <ol className="flex flex-col gap-4">
      {messages.map(({ id, role, paragraphs }) => (
        <li key={id} className="flex">
          <ChatBubble role={role}>
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </ChatBubble>
        </li>
      ))}
      <div ref={endRef} aria-hidden />
    </ol>
  )
}
