import { useNavigate, useParams } from 'react-router'

import { Button } from '@/components/common'
import { AppLayout } from '@/components/layout'
import { PrescriptionDetailView } from '@/features/diagnosis/components/PrescriptionDetailView'
import { MOCK_PRESCRIPTION_DETAILS, MOCK_USER } from '@/features/diagnosis/mockData'
import { PATHS } from '@/routes/paths'

/** 04e 처방 실행. 처방 유형마다 내용이 달라 지금은 인건비 구조 점검만 있습니다. */
export function PrescriptionPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()

  const detail = MOCK_PRESCRIPTION_DETAILS[id]

  if (!detail) {
    return (
      <AppLayout title="우리 가게 진단" user={MOCK_USER}>
        <div className="flex flex-col items-start gap-4 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
          <p className="text-body-m text-text-secondary">
            아직 준비 중인 처방입니다. 진단 리포트에서 다른 처방을 선택해 주세요.
          </p>
          <Button variant="secondary" onClick={() => navigate(PATHS.diagnosis)}>
            진단 리포트로 돌아가기
          </Button>
        </div>
      </AppLayout>
    )
  }

  const index = Object.keys(MOCK_PRESCRIPTION_DETAILS).indexOf(id) + 1

  return (
    <AppLayout title="우리 가게 진단" user={MOCK_USER}>
      <div className="flex flex-col gap-1">
        <p className="text-caption text-text-tertiary">
          우리 가게 진단 › 2026년 8월 진단 리포트 › 맞춤 처방 {index}
        </p>
        <h2 className="text-heading-l font-bold text-text-primary">{detail.title}</h2>
        <p className="text-body-s text-text-secondary">{detail.meta}</p>
      </div>

      {/* TODO: 실행 계획 저장 API와 AI 도우미 화면이 생기면 연결합니다. */}
      <PrescriptionDetailView detail={detail} />
    </AppLayout>
  )
}
