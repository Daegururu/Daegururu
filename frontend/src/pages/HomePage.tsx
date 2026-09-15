import { useNavigate } from 'react-router'

import { AppLayout } from '@/components/layout'
import { CashFlowCard } from '@/features/home/components/CashFlowCard'
import { DashboardStatusCard } from '@/features/home/components/DashboardStatusCard'
import { EmptyReportCard } from '@/features/home/components/EmptyReportCard'
import { FixedCostCard } from '@/features/home/components/FixedCostCard'
import { MetricSummaryGrid } from '@/features/home/components/MetricSummaryGrid'
import { RiskHeroCard } from '@/features/home/components/RiskHeroCard'
import { SupportProgramSection } from '@/features/home/components/SupportProgramSection'
import { useDashboardSummary } from '@/features/home/hooks/useDashboardSummary'
import {
  toCashFlowPoints,
  toDiagnosisSummary,
  toFixedCostItems,
  toFixedCostNote,
  toMetrics,
  toSupportPrograms,
} from '@/features/home/mapping'
import { PATHS, financeDetailPath } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'

/** 03 홈 대시보드. 업종 평균을 켠 모습이 03-1 입니다. */
export function HomePage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { data, isPending, isError, error, refetch } = useDashboardSummary()

  // TODO: 가게 주소는 GET /stores/me 연동 후 붙입니다.
  const userLabel = user ? `${user.representativeName} 사장님` : ''

  const renderBody = () => {
    if (isPending) return <DashboardStatusCard loading />
    if (isError)
      return <DashboardStatusCard errorMessage={error.message} onRetry={() => refetch()} />

    const { hasReport, risk, metrics, cashflowChart, fixedCostBreakdown, recommendedProducts } =
      data

    // 진단 이력이 없으면(DASH2001) 히어로 자리에 안내 카드만 둡니다.
    if (!hasReport || !risk || !metrics || !cashflowChart || !fixedCostBreakdown) {
      return <EmptyReportCard onStart={() => navigate(PATHS.onboardingStore)} />
    }

    const fixedCostItems = toFixedCostItems(fixedCostBreakdown.items)

    return (
      <>
        <RiskHeroCard
          diagnosis={toDiagnosisSummary(risk)}
          onViewReport={() => navigate(PATHS.diagnosis)}
        />

        <MetricSummaryGrid metrics={toMetrics(metrics)} />

        {/* 현금흐름 : 고정비 = 700 : 412 (Figma 기준 비율) */}
        <div className="grid grid-cols-[700fr_412fr] gap-6">
          {/*
           * TODO(백엔드): cashflowChart.values가 월별 매출 합계라 "현금흐름 추이"와 뜻이 다릅니다.
           * 월별 순현금흐름(매출 - 고정비)으로 바꿔달라고 요청한 상태이고, 업종 평균 참고선도 같은 기준이어야 합니다.
           * 응답 구조는 그대로라 값만 바뀌면 프론트 수정 없이 반영됩니다.
           */}
          <CashFlowCard
            points={toCashFlowPoints(cashflowChart)}
            average={cashflowChart.industryAvgReference.value}
            note={metrics.cashflow.note}
          />
          <FixedCostCard
            items={fixedCostItems}
            note={toFixedCostNote(fixedCostItems)}
            averageAvailable={fixedCostBreakdown.industryAvgAvailable}
          />
        </div>

        {/* 두 섹션 사이는 카드 간격(24px)보다 넓은 48px로 띄웁니다. */}
        <SupportProgramSection
          className="mt-6"
          programs={toSupportPrograms(recommendedProducts)}
          onViewAll={() => navigate(PATHS.finance)}
          onViewDetail={(id) => navigate(financeDetailPath(id))}
        />
      </>
    )
  }

  return (
    <AppLayout title="홈" user={userLabel}>
      <section className="flex flex-col gap-6">
        <h2 className="text-heading-s font-bold text-text-primary">우리 가게 진단</h2>
        {renderBody()}
      </section>
    </AppLayout>
  )
}
