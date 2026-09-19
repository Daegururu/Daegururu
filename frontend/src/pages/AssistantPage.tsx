import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'

import { AppLayout } from '@/components/layout'
import { ChatComposer } from '@/features/assistant/components/ChatComposer'
import { ChatMessageList } from '@/features/assistant/components/ChatMessageList'
import { DiagnosisRequiredModal } from '@/features/assistant/components/DiagnosisRequiredModal'
import { SUGGESTED_QUESTIONS, greetingParagraphs } from '@/features/assistant/constants'
import { useAssistantChat } from '@/features/assistant/hooks/useAssistantChat'
import { useDiagnosisGate } from '@/features/assistant/hooks/useDiagnosisGate'
import { PATHS } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'

/** 05 AI 도우미 */
export function AssistantPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const userLabel = user ? `${user.representativeName} 사장님` : ''

  // 대화 이력 API가 없어서 첫 인사만 프론트에서 붙이고, 이후는 서버 답변으로 채웁니다.
  const chat = useAssistantChat(greetingParagraphs(user?.representativeName ?? ''))

  // 진단 전에는 답변의 근거가 될 데이터가 없어서 고정비 0원짜리 답이 나갑니다.
  // 그래서 대화를 막고 진단으로 보냅니다. 진단 여부를 끝내 확인하지 못했으면 막지 않습니다.
  const { hasReport, isChecking } = useDiagnosisGate()
  const blocked = hasReport === false

  // 메시지가 붙거나 답변이 채워지면 맨 아래로 내립니다. 입력창이 아래에 붙어 있어서
  // 마지막 말풍선이 아니라 입력창 아래 지점을 기준으로 내려야 말풍선이 가려지지 않습니다.
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [chat.messages])

  return (
    <AppLayout title="AI 도우미" user={userLabel}>
      {/* 대화 컬럼은 840px로 고정하고 가운데 둡니다. flex-1로 화면 높이를 채워서
          대화가 짧아도 입력창이 맨 아래에 갑니다. */}
      <div className="mx-auto flex w-full max-w-[840px] flex-1 flex-col">
        <ChatMessageList messages={chat.messages} onRetry={chat.retry} isSending={chat.isSending} />

        {/* 입력창은 항상 화면 아래에 있습니다. 대화가 짧으면 mt-auto로 내려가고, 길어지면 sticky로
            스크롤을 따라옵니다. main의 아래 여백(p-8)만큼 음수 마진을 줘서 끝까지 내렸을 때 위치가
            튀지 않게 하고, 뒤로 지나가는 말풍선이 비치지 않게 배경을 깝니다. */}
        <div className="sticky bottom-0 mt-auto -mb-8 bg-bg-canvas pt-4 pb-8">
          <ChatComposer
            suggestions={SUGGESTED_QUESTIONS}
            onSend={chat.send}
            disabled={chat.isSending || blocked || isChecking}
          />
        </div>
        <div ref={bottomRef} aria-hidden />
      </div>

      <DiagnosisRequiredModal open={blocked} onStart={() => navigate(PATHS.onboardingStore)} />
    </AppLayout>
  )
}
