import { useNavigate } from 'react-router'

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
import { PATHS } from '@/routes/paths'

/** 03 홈 대시보드. 업종 평균을 켠 모습이 03-1 입니다. */
export function HomePage() {
  const navigate = useNavigate()

  // TODO: 진단 결과·거래내역·추천 상품 API 연동. 지금은 전부 목데이터입니다.
  // 07 금융 지원과 08 상품 상세는 아직 화면이 없어 이동 함수를 넘기지 않습니다.
  return (
    <AppLayout title="홈" user={MOCK_USER}>
      {/* 진단 결과 영역과 그에 따른 추천 영역을 섹션 제목으로 나눕니다. */}
      <section className="flex flex-col gap-6">
        <h2 className="text-heading-s font-bold text-text-primary">우리 가게 진단</h2>

        <RiskHeroCard diagnosis={MOCK_DIAGNOSIS} onViewReport={() => navigate(PATHS.diagnosis)} />

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
      </section>

      {/* 두 섹션 사이는 카드 간격(24px)보다 넓은 48px로 띄웁니다. */}
      <SupportProgramSection className="mt-6" programs={MOCK_SUPPORT_PROGRAMS} />
    </AppLayout>
  )
}
