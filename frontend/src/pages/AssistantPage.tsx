import { useState } from 'react'

import { AppLayout } from '@/components/layout'
import { ChatComposer } from '@/features/assistant/components/ChatComposer'
import { ChatMessageList } from '@/features/assistant/components/ChatMessageList'
import {
  MOCK_FALLBACK_REPLY,
  MOCK_MESSAGES,
  MOCK_SUGGESTED_QUESTIONS,
  MOCK_USER,
} from '@/features/assistant/mockData'
import type { ChatMessage } from '@/features/assistant/types'

/** 05 AI 도우미 */
export function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES)

  // TODO: 채팅 API 연동. 지금은 어떤 질문에도 목데이터 답변을 붙입니다.
  const handleSend = (text: string) => {
    const stamp = Date.now()
    setMessages((prev) => [
      ...prev,
      { id: `user-${stamp}`, role: 'user', paragraphs: [text] },
      { id: `ai-${stamp}`, role: 'ai', paragraphs: MOCK_FALLBACK_REPLY },
    ])
  }

  return (
    <AppLayout title="AI 도우미" user={MOCK_USER}>
      {/* 대화 컬럼은 840px로 고정하고 가운데 둡니다. */}
      <div className="mx-auto flex w-full max-w-[840px] flex-col gap-4">
        <ChatMessageList messages={messages} />
        <ChatComposer suggestions={MOCK_SUGGESTED_QUESTIONS} onSend={handleSend} />
      </div>
    </AppLayout>
  )
}
