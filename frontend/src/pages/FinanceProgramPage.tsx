import { useNavigate, useParams } from 'react-router'

import { ApiError } from '@/apis/client'
import { Button, StatusCard, StatusChip } from '@/components/common'
import { AppLayout } from '@/components/layout'
import { DetailCard } from '@/features/finance/components/DetailCard'
import { useExternalProgram } from '@/features/finance/hooks/useFinance'
import { parseProductId } from '@/features/finance/mapping'
import { PATHS } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'

/** 지원사업 공고 상세. 07 목록의 공고 카드에서 들어오고, [신청하러 가기]는 공고 원문을 새 탭으로 엽니다. */
export function FinanceProgramPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const user = useAuthStore((state) => state.user)
  const userLabel = user ? `${user.representativeName} 사장님` : ''

  const programId = parseProductId(id)
  const program = useExternalProgram(programId)

  // 경로 id가 숫자가 아니거나 서버에 없는 공고(404)면 같은 안내를 보여줍니다.
  const notFound =
    programId === null ||
    (program.isError && program.error instanceof ApiError && program.error.status === 404)

  if (notFound) {
    return (
      <AppLayout title="금융 지원" user={userLabel}>
        <div className="flex flex-col items-start gap-4 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
          <p className="text-body-m text-text-secondary">
            찾을 수 없는 공고입니다. 금융 지원에서 다른 공고를 골라 주세요.
          </p>
          <Button variant="secondary" onClick={() => navigate(PATHS.finance)}>
            금융 지원으로 돌아가기
          </Button>
        </div>
      </AppLayout>
    )
  }

  if (program.isPending) {
    return (
      <AppLayout title="금융 지원" user={userLabel}>
        <StatusCard loading loadingMessage="공고 정보를 불러오는 중이에요..." />
      </AppLayout>
    )
  }

  if (program.isError) {
    return (
      <AppLayout title="금융 지원" user={userLabel}>
        <StatusCard errorMessage={program.error.message} onRetry={() => program.refetch()} />
      </AppLayout>
    )
  }

  const detail = program.data

  const info = [
    { label: '소관기관', value: detail.agency },
    { label: '지원 대상', value: detail.target || '대상 제한 없음' },
    { label: '지원 분야', value: detail.category },
    { label: '신청 기간', value: detail.applyPeriod },
  ]

  return (
    <AppLayout title="금융 지원" user={userLabel}>
      {/* 헤더는 카드 간격보다 좁게 붙여 한 덩어리로 보이게 합니다. */}
      <div className="-mb-2 flex flex-col gap-4">
        <p className="text-caption text-text-tertiary">
          금융 지원 › 지원사업 공고 › {detail.title}
        </p>
        <div className="flex items-center gap-3">
          <h2 className="text-heading-l font-bold text-text-primary">{detail.title}</h2>
          <StatusChip tone="info">{detail.sourceLabel}</StatusChip>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_364px] items-start gap-6">
        <DetailCard title="공고 요약">
          {detail.summaryParagraphs.length > 0 ? (
            <div className="flex flex-col gap-2">
              {detail.summaryParagraphs.map((paragraph, index) => (
                <p key={index} className="text-body-m text-text-secondary">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-body-m text-text-secondary">
              요약이 없는 공고입니다. 자세한 내용은 원문에서 확인해 주세요.
            </p>
          )}
        </DetailCard>

        <div className="flex flex-col gap-4">
          <DetailCard title="공고 정보">
            <dl className="flex flex-col gap-3">
              {info.map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <dt className="shrink-0 text-body-m text-text-secondary">{label}</dt>
                  <dd className="text-right text-body-m font-medium text-text-primary">
                    {value || '-'}
                  </dd>
                </div>
              ))}
            </dl>
            {/* 신청은 외부 사이트에서 합니다. 앱을 떠나지 않도록 새 탭으로 엽니다. */}
            <Button
              className="w-full"
              onClick={() => window.open(detail.detailUrl, '_blank', 'noopener')}
            >
              신청하러 가기
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate(PATHS.assistant)}
            >
              AI에게 물어보기
            </Button>
          </DetailCard>

          <div className="flex flex-col gap-2 rounded-lg bg-brand-subtle p-6">
            <p className="text-body-m font-medium text-text-brand">외부 공고 안내</p>
            <p className="text-body-s text-text-secondary">
              {detail.sourceLabel}에서 가져온 공고입니다. 자격 조건과 제출 서류는 원문 기준이며,
              신청도 해당 사이트에서 진행됩니다.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
