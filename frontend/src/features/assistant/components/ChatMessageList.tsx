import { useEffect, useState } from 'react'

import { Button, ChatBubble } from '@/components/common'
import type { ChatMessage } from '@/features/assistant/types'

/** 타이핑 효과에서 글자 하나가 찍히는 간격(ms) */
const TYPE_INTERVAL_MS = 18

export interface ChatMessageListProps {
  messages: ChatMessage[]
  /** 실패한 AI 말풍선의 [다시 보내기]를 눌렀을 때 */
  onRetry: (id: string) => void
  /** 답변을 기다리는 동안 true. 겹쳐 보낼 수 없어서 [다시 보내기]를 잠급니다. */
  isSending?: boolean
}

/** 대화 말풍선 목록입니다. AI는 왼쪽, 사용자는 오른쪽에 붙습니다. */
export function ChatMessageList({ messages, onRetry, isSending = false }: ChatMessageListProps) {
  return (
    // 대기 중 말풍선이 답변으로 바뀌며 사라져서, 목록 자체를 읽어 주도록 해야
    // 스크린 리더가 답변이 도착한 것을 알 수 있습니다.
    <ol role="log" aria-live="polite" className="flex flex-col gap-4">
      {messages.map(({ id, role, paragraphs, status, typewriter }) => (
        // 새 말풍선은 아래에서 올라오며 나타납니다. 움직임을 줄인 설정에서는 바로 보여줍니다.
        <li key={id} className="flex motion-safe:animate-bubble-in">
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
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isSending}
                onClick={() => onRetry(id)}
              >
                다시 보내기
              </Button>
            </ChatBubble>
          ) : typewriter ? (
            <ChatBubble role={role}>
              <TypewriterParagraphs paragraphs={paragraphs} />
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

/**
 * 문단을 한 글자씩 쳐지듯 보여줍니다. 전체 글자 수를 기준으로 앞에서부터 드러내고,
 * 다 드러나면 멈춥니다. 움직임을 줄인 설정에서는 처음부터 전부 보여줍니다.
 */
function TypewriterParagraphs({ paragraphs }: { paragraphs: string[] }) {
  const total = paragraphs.reduce((sum, paragraph) => sum + paragraph.length, 0)
  const [shown, setShown] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? total : 0,
  )
  const typing = shown < total

  useEffect(() => {
    if (!typing) return
    const timer = window.setInterval(() => {
      setShown((prev) => Math.min(prev + 1, total))
    }, TYPE_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [typing, total])

  // 문단마다 앞 문단들의 글자 수를 뺀 만큼만 드러냅니다. 아직 안 드러난 부분도 투명하게
  // 자리를 차지해 두어, 줄이 늘어나며 말풍선 높이가 변하지 않습니다.
  return paragraphs.map((paragraph, index) => {
    const before = paragraphs.slice(0, index).reduce((sum, prev) => sum + prev.length, 0)
    const revealed = Math.max(shown - before, 0)
    return (
      <p key={index} className="min-h-6">
        {paragraph.slice(0, revealed)}
        <span aria-hidden className="opacity-0">
          {paragraph.slice(revealed)}
        </span>
      </p>
    )
  })
}
