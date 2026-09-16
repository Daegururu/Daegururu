import { useNavigate, useParams } from 'react-router'

import { ApiError } from '@/apis/client'
import { Button, StatusCard, StatusChip } from '@/components/common'
import { AppLayout } from '@/components/layout'
import { ProductDetailView } from '@/features/finance/components/ProductDetailView'
import { CATEGORY_LABEL } from '@/features/finance/constants'
import { useFinanceProduct } from '@/features/finance/hooks/useFinance'
import { parseProductId } from '@/features/finance/mapping'
import { PATHS, financeApplyPath } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'

/** 08 상품 상세 */
export function FinanceDetailPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const user = useAuthStore((state) => state.user)
  const userLabel = user ? `${user.representativeName} 사장님` : ''

  const productId = parseProductId(id)
  const product = useFinanceProduct(productId)

  // 경로 id가 숫자가 아니거나 서버에 없는 상품(404)이면 같은 안내를 보여줍니다.
  const notFound =
    productId === null ||
    (product.isError && product.error instanceof ApiError && product.error.status === 404)

  if (notFound) {
    return (
      <AppLayout title="금융 지원" user={userLabel}>
        <div className="flex flex-col items-start gap-4 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
          <p className="text-body-m text-text-secondary">
            찾을 수 없는 상품입니다. 금융 지원에서 다른 상품을 골라 주세요.
          </p>
          <Button variant="secondary" onClick={() => navigate(PATHS.finance)}>
            금융 지원으로 돌아가기
          </Button>
        </div>
      </AppLayout>
    )
  }

  if (product.isPending) {
    return (
      <AppLayout title="금융 지원" user={userLabel}>
        <StatusCard loading loadingMessage="상품 정보를 불러오는 중이에요..." />
      </AppLayout>
    )
  }

  if (product.isError) {
    return (
      <AppLayout title="금융 지원" user={userLabel}>
        <StatusCard errorMessage={product.error.message} onRetry={() => product.refetch()} />
      </AppLayout>
    )
  }

  const detail = product.data

  return (
    <AppLayout title="금융 지원" user={userLabel}>
      {/* 헤더는 카드 간격보다 좁게 붙여 한 덩어리로 보이게 합니다. */}
      <div className="-mb-2 flex flex-col gap-4">
        <p className="text-caption text-text-tertiary">
          금융 지원 › {CATEGORY_LABEL[detail.category]} › {detail.name}
        </p>
        <div className="flex items-center gap-3">
          <h2 className="text-heading-l font-bold text-text-primary">{detail.name}</h2>
          <StatusChip tone={detail.eligible ? 'safe' : 'warn'}>{detail.status}</StatusChip>
        </div>
      </div>

      {/* TODO: AI 도우미에 상품 컨텍스트 전달은 채팅 API 연동(#33)에서 합니다. */}
      <ProductDetailView
        product={detail}
        onApply={() => navigate(financeApplyPath(String(detail.id)))}
        onAskAi={() => navigate(PATHS.assistant)}
      />
    </AppLayout>
  )
}
