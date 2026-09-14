import { Button } from '@/components/common'
import { DetailCard } from '@/features/finance/components/DetailCard'
import type { FinanceProductDetail } from '@/features/finance/types'

export interface ProductDetailViewProps {
  product: FinanceProductDetail
  onApply: () => void
  onAskAi: () => void
}

/** 08 상품 상세 본문. 왼쪽은 개요·자격·서류, 오른쪽은 신청 요약과 진단 연동 안내입니다. */
export function ProductDetailView({ product, onApply, onAskAi }: ProductDetailViewProps) {
  const { overview, limit, rate, termDetail, eligibility, documents, summary, diagnosisNote } =
    product

  const metrics = [
    { label: '한도', value: limit },
    { label: '금리', value: rate },
    { label: '기간', value: termDetail },
  ]

  return (
    <div className="grid grid-cols-[1fr_364px] items-start gap-6">
      <div className="flex flex-col gap-6">
        <DetailCard title="상품 개요">
          <p className="text-body-m text-text-secondary">{overview}</p>
          <dl className="grid grid-cols-3 gap-4">
            {metrics.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1 rounded-md bg-bg-subtle px-5 py-4">
                <dd className="text-number-l font-bold whitespace-nowrap text-text-primary">
                  {value}
                </dd>
                <dt className="text-caption text-text-tertiary">{label}</dt>
              </div>
            ))}
          </dl>
        </DetailCard>

        <DetailCard title="자격 매칭 근거">
          <ul className="flex flex-col gap-3">
            {eligibility.map(({ condition, evidence }) => (
              <li key={condition} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-6 shrink-0 items-center justify-center rounded-full bg-status-safe text-caption text-text-inverse"
                >
                  ✓
                </span>
                <span className="flex-1 text-body-m text-text-primary">{condition}</span>
                <span className="text-body-s text-text-secondary">{evidence}</span>
              </li>
            ))}
          </ul>
        </DetailCard>

        <DetailCard title="필요 서류">
          <ul className="flex flex-col gap-2.5">
            {documents.map((document) => (
              <li key={document} className="text-body-m text-text-secondary">
                · {document}
              </li>
            ))}
          </ul>
        </DetailCard>
      </div>

      <div className="flex flex-col gap-4">
        <DetailCard title="신청 요약">
          <dl className="flex flex-col gap-3">
            {summary.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <dt className="text-body-m text-text-secondary">{label}</dt>
                <dd className="text-body-m font-medium text-text-primary">{value}</dd>
              </div>
            ))}
          </dl>
          <Button className="w-full" onClick={onApply}>
            신청하기
          </Button>
          <Button variant="secondary" className="w-full" onClick={onAskAi}>
            AI에게 물어보기
          </Button>
        </DetailCard>

        <div className="flex flex-col gap-2 rounded-lg bg-brand-subtle p-6">
          <p className="text-body-m font-medium text-text-brand">진단 결과 연동</p>
          <p className="text-body-s text-text-secondary">{diagnosisNote}</p>
        </div>
      </div>
    </div>
  )
}
