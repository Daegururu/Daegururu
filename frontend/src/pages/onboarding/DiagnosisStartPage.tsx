import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/common'
import { OnboardingLayout } from '@/components/layout'
import { useOnboarding } from '@/features/onboarding/onboardingContext'
import { formatBusinessPeriod } from '@/utils/date'

/** 이번 진단에서 확인하는 항목 */
const DIAGNOSIS_SCOPES = ['매출 추이', '고정비 구조', '현금흐름', '정산 주기', '업종 평균 대비']

/** 02c 온보딩 · 진단 시작 */
export function DiagnosisStartPage() {
  const navigate = useNavigate()
  const { storeInfo } = useOnboarding()

  // 가게 정보 없이 이 화면에 직접 들어오면 입력 단계로 되돌립니다.
  useEffect(() => {
    if (!storeInfo.name) navigate('/onboarding/store', { replace: true })
  }, [storeInfo.name, navigate])

  const summary = [
    { label: '상호명', value: storeInfo.name },
    { label: '업종', value: storeInfo.category },
    { label: '사업장', value: storeInfo.address },
    { label: '사업기간', value: formatBusinessPeriod(storeInfo.openedAt) },
  ]

  const handleStart = () => {
    // TODO: 진단 실행 API 연동
    navigate('/home')
  }

  return (
    <OnboardingLayout currentStep={2}>
      <div className="flex flex-col gap-2">
        <h1 className="text-heading-m font-bold text-text-primary">진단을 시작할 준비가 됐어요</h1>
        <p className="text-body-m text-text-secondary">
          입력한 가게 정보를 바탕으로 폐업 위험 점수와 그 원인을 분석합니다. 매출·비용 데이터는 다음
          화면에서 직접 입력할 수 있어요. 분석에는 약 30초가 걸립니다.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-md border border-border-default p-5">
        <p className="text-body-s font-medium text-text-secondary">가게 정보</p>
        {/* 라벨은 왼쪽, 값은 카드 오른쪽 끝에 붙입니다. */}
        <dl className="flex flex-col gap-2.5">
          {summary.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <dt className="text-body-s text-text-tertiary">{label}</dt>
              <dd className="text-body-s font-medium text-text-primary">{value || '-'}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-body-s font-medium text-text-secondary">이번 진단에서 확인하는 것</p>
        <ul className="flex flex-wrap gap-2">
          {DIAGNOSIS_SCOPES.map((scope) => (
            <li
              key={scope}
              className="rounded-full bg-brand-subtle px-3.5 py-1.5 text-body-s font-medium text-text-brand"
            >
              {scope}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/onboarding/store')}>
          이전
        </Button>
        <Button onClick={handleStart}>진단 시작하기</Button>
      </div>
    </OnboardingLayout>
  )
}
