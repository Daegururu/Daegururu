import { useNavigate, useParams } from 'react-router'

import { Button, StatusChip } from '@/components/common'
import { AppLayout } from '@/components/layout'
import { ProductDetailView } from '@/features/finance/components/ProductDetailView'
import { CATEGORY_LABEL, MOCK_USER, findProduct } from '@/features/finance/mockData'
import { PATHS, financeApplyPath } from '@/routes/paths'

/** 08 상품 상세 */
export function FinanceDetailPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()

  const product = findProduct(id)

  if (!product) {
    return (
      <AppLayout title="금융 지원" user={MOCK_USER}>
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

  return (
    <AppLayout title="금융 지원" user={MOCK_USER}>
      {/* 헤더는 카드 간격보다 좁게 붙여 한 덩어리로 보이게 합니다. */}
      <div className="-mb-2 flex flex-col gap-4">
        <p className="text-caption text-text-tertiary">
          금융 지원 › {CATEGORY_LABEL[product.category]} › {product.name}
        </p>
        <div className="flex items-center gap-3">
          <h2 className="text-heading-l font-bold text-text-primary">{product.name}</h2>
          <StatusChip tone="safe">{product.status}</StatusChip>
        </div>
      </div>

      {/* TODO: 상품 상세 API 연동. AI 도우미에는 상품 컨텍스트 전달이 아직 없습니다. */}
      <ProductDetailView
        product={product}
        onApply={() => navigate(financeApplyPath(product.id))}
        onAskAi={() => navigate(PATHS.assistant)}
      />
    </AppLayout>
  )
}
