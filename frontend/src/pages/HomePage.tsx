import { AppLayout } from '@/components/layout'
import { CashFlowCard } from '@/features/home/components/CashFlowCard'
import { FixedCostCard } from '@/features/home/components/FixedCostCard'
import { MetricSummaryGrid } from '@/features/home/components/MetricSummaryGrid'
import { RiskHeroCard } from '@/features/home/components/RiskHeroCard'
import { SupportProgramSection } from '@/features/home/components/SupportProgramSection'
import {
  MOCK_CASH_FLOW,
  MOCK_CASH_FLOW_AVERAGE,
  MOCK_CASH_FLOW_NOTE,
  MOCK_DIAGNOSIS,
  MOCK_FIXED_COSTS,
  MOCK_FIXED_COST_NOTE,
  MOCK_METRICS,
  MOCK_SUPPORT_PROGRAMS,
  MOCK_USER,
} from '@/features/home/mockData'

/** 03 홈 대시보드. 업종 평균을 켠 모습이 03-1 입니다. */
export function HomePage() {
  // TODO: 진단 결과·거래내역·추천 상품 API 연동. 지금은 전부 목데이터입니다.
  const goToPlaceholder = () => {}

  return (
    <AppLayout title="홈" user={MOCK_USER}>
      <RiskHeroCard diagnosis={MOCK_DIAGNOSIS} onViewReport={goToPlaceholder} />

      <MetricSummaryGrid metrics={MOCK_METRICS} />

      {/* 현금흐름 : 고정비 = 700 : 412 (Figma 기준 비율) */}
      <div className="grid grid-cols-[700fr_412fr] gap-6">
        <CashFlowCard
          points={MOCK_CASH_FLOW}
          average={MOCK_CASH_FLOW_AVERAGE}
          note={MOCK_CASH_FLOW_NOTE}
        />
        <FixedCostCard items={MOCK_FIXED_COSTS} note={MOCK_FIXED_COST_NOTE} />
      </div>

      <SupportProgramSection
        programs={MOCK_SUPPORT_PROGRAMS}
        onViewAll={goToPlaceholder}
        onViewDetail={goToPlaceholder}
      />
    </AppLayout>
  )
}
