import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { sendChatMessage } from '@/apis/chatbot'

import type { ChatMessage } from '../types'

/**
 * 대화 목록과 전송 상태를 관리합니다.
 * 서버에 대화 이력이 없어서 목록은 화면을 떠나면 사라집니다. 첫 인사는 호출하는 쪽이 넣어 줍니다.
 */
export function useAssistantChat(greeting: string[]) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'greeting', role: 'ai', paragraphs: greeting, typewriter: true },
  ])

  // 특정 AI 말풍선(id)만 바꿉니다. 답변이 오거나 실패하면 로딩 자리를 그 결과로 채웁니다.
  const replaceMessage = (id: string, patch: Partial<ChatMessage>) => {
    setMessages((prev) =>
      prev.map((message) => (message.id === id ? { ...message, ...patch } : message)),
    )
  }

  const reply = useMutation({
    mutationFn: ({ question }: { id: string; question: string }) => sendChatMessage(question),
    onSuccess: ({ paragraphs }, { id }) => {
      replaceMessage(id, { paragraphs, status: undefined, question: undefined })
    },
    onError: (error, { id, question }) => {
      replaceMessage(id, { paragraphs: [error.message], status: 'error', question })
    },
  })

  /** 질문을 보냅니다. 사용자 말풍선과 로딩 중인 AI 말풍선을 먼저 붙이고 답변이 오면 채웁니다. */
  const send = (question: string) => {
    const stamp = Date.now()
    const aiId = `ai-${stamp}`
    setMessages((prev) => [
      ...prev,
      { id: `user-${stamp}`, role: 'user', paragraphs: [question] },
      { id: aiId, role: 'ai', paragraphs: [], status: 'pending' },
    ])
    reply.mutate({ id: aiId, question })
  }

  /** 실패한 AI 말풍선을 다시 로딩 상태로 돌리고 같은 질문을 다시 보냅니다. */
  const retry = (id: string) => {
    // 다른 답변을 기다리는 중이면 겹쳐 보내지 않습니다.
    if (reply.isPending) return
    const target = messages.find((message) => message.id === id)
    if (!target?.question) return
    replaceMessage(id, { paragraphs: [], status: 'pending' })
    reply.mutate({ id, question: target.question })
  }

  return { messages, send, retry, isSending: reply.isPending }
}
