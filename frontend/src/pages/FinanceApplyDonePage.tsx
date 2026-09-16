import { useNavigate, useParams } from 'react-router'

import { Button } from '@/components/common'
import { ApplyLayout } from '@/features/finance/components/ApplyLayout'
import { ApplyProductStatus } from '@/features/finance/components/ApplyProductStatus'
import { useFinanceProduct } from '@/features/finance/hooks/useFinance'
import { parseProductId } from '@/features/finance/mapping'
import { MOCK_APPLICATION_RECEIPT } from '@/features/finance/mockData'
import { PATHS } from '@/routes/paths'
import { toCalendarDate } from '@/utils/date'

/** 09b 신청 완료. 확인하면 금융 지원 목록으로 돌아갑니다. */
export function FinanceApplyDonePage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()

  const productId = parseProductId(id)
  const product = useFinanceProduct(productId)

  if (productId === null || !product.data) {
    return <ApplyProductStatus productId={productId} query={product} currentStep={4} />
  }

  const productName = product.data.name

  // TODO: 신청 제출 API가 붙으면 접수 정보를 응답으로 교체합니다. 지금은 예시 값입니다.
  const { amount, receiptNumber } = MOCK_APPLICATION_RECEIPT
  const summary = [
    { label: '상품', value: productName },
    { label: '신청 금액', value: amount },
    { label: '접수일', value: toCalendarDate(new Date()) },
  ]

  return (
    <ApplyLayout productName={productName} currentStep={4} hideSteps>
      <span
        aria-hidden
        className="flex size-20 items-center justify-center rounded-full bg-status-safe text-display-xl font-bold text-text-inverse"
      >
        ✓
      </span>
      <h1 className="text-heading-l font-bold text-text-primary">신청이 접수되었습니다</h1>
      <p className="text-center text-body-m text-text-secondary">
        심사 결과는 영업일 기준 3일 이내에 알림으로 안내드립니다.
        <br />
        접수번호 {receiptNumber}
      </p>

      <p role="note" className="text-caption text-text-tertiary">
        신청 접수 기능은 준비 중이라 위 접수 정보는 예시입니다.
      </p>

      <dl className="flex w-full flex-col gap-2.5 rounded-md bg-bg-subtle px-6 py-5">
        {summary.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <dt className="text-body-m text-text-secondary">{label}</dt>
            <dd className="text-body-m font-medium text-text-primary">{value}</dd>
          </div>
        ))}
      </dl>

      <Button className="w-full" onClick={() => navigate(PATHS.finance)}>
        금융 지원으로 돌아가기
      </Button>
    </ApplyLayout>
  )
}
