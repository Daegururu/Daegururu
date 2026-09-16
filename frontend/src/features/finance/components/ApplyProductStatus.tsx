import { useNavigate } from 'react-router'

import { ApiError } from '@/apis/client'
import { Button, StatusCard } from '@/components/common'
import { ApplyLayout, type ApplyLayoutProps } from '@/features/finance/components/ApplyLayout'
import type { FinanceProductDetail } from '@/features/finance/types'
import { PATHS } from '@/routes/paths'

export interface ApplyProductStatusProps {
  /** parseProductId 결과. null이면 경로 id가 숫자가 아닙니다. */
  productId: number | null
  query: {
    isPending: boolean
    isError: boolean
    error: Error | null
    data: FinanceProductDetail | undefined
    refetch: () => unknown
  }
  currentStep: ApplyLayoutProps['currentStep']
}

/**
 * 09·09b가 상품을 받는 동안·못 받았을 때 보여주는 상태 화면입니다.
 * 잘못된 id·404는 "없는 상품", 그 외 실패는 [다시 시도], 대기 중은 로딩 카드입니다.
 * 정상이면 null을 돌려주고 호출 쪽이 본문을 그립니다.
 */
export function ApplyProductStatus({ productId, query, currentStep }: ApplyProductStatusProps) {
  const navigate = useNavigate()

  const notFound =
    productId === null ||
    (query.isError && query.error instanceof ApiError && query.error.status === 404)

  if (notFound) {
    return (
      <ApplyLayout productName="지원사업" currentStep={currentStep} hideSteps>
        <p className="text-body-m text-text-secondary">찾을 수 없는 상품입니다.</p>
        <Button variant="secondary" onClick={() => navigate(PATHS.finance)}>
          금융 지원으로 돌아가기
        </Button>
      </ApplyLayout>
    )
  }

  if (query.isError) {
    return (
      <ApplyLayout productName="지원사업" currentStep={currentStep} hideSteps>
        <StatusCard
          errorMessage={query.error?.message ?? '상품 정보를 불러오지 못했습니다'}
          onRetry={() => query.refetch()}
        />
      </ApplyLayout>
    )
  }

  if (query.isPending) {
    return (
      <ApplyLayout productName="지원사업" currentStep={currentStep} hideSteps>
        <StatusCard loading loadingMessage="상품 정보를 불러오는 중이에요..." />
      </ApplyLayout>
    )
  }

  return null
}
