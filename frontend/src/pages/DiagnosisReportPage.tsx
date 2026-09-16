import { useState } from 'react'
import { useNavigate } from 'react-router'

import { EmptyReportCard, StatusCard, Tab } from '@/components/common'
import { AppLayout } from '@/components/layout'
import { CashFlowTabPanel } from '@/features/diagnosis/components/CashFlowTabPanel'
import { CauseCard } from '@/features/diagnosis/components/CauseCard'
import { FixedCostTabPanel } from '@/features/diagnosis/components/FixedCostTabPanel'
import { PrescriptionList } from '@/features/diagnosis/components/PrescriptionList'
import { ReportHeader } from '@/features/diagnosis/components/ReportHeader'
import { RiskScoreBar } from '@/features/diagnosis/components/RiskScoreBar'
import { SalesTabPanel } from '@/features/diagnosis/components/SalesTabPanel'
import { SettlementTabPanel } from '@/features/diagnosis/components/SettlementTabPanel'
import {
  useDiagnosisReport,
  useDiagnosisTabQueries,
} from '@/features/diagnosis/hooks/useDiagnosisReport'
import {
  toCashFlowNote,
  toCause,
  toFixedCostMeta,
  toFixedCostNote,
  toFixedCostRows,
  toFixedCostShares,
  toMonthlyAmounts,
  toPrescriptions,
  toRecentCashFlow,
  toRecentCashFlowNote,
  toReportSummary,
  toSalesNote,
  toSettlementStats,
} from '@/features/diagnosis/mapping'
import type { ReportTab } from '@/features/diagnosis/types'
import { PATHS, prescriptionPath } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'

/** 탭 4개. Figma 04 / 04b / 04c / 04d는 이 탭 상태만 다른 같은 화면입니다. */
const TABS: { id: ReportTab; label: string }[] = [
  { id: 'sales', label: '매출 추이' },
  { id: 'fixedCost', label: '고정비' },
  { id: 'cashFlow', label: '현금흐름' },
  { id: 'settlement', label: '정산' },
]

const SETTLEMENT_NOTE = '카드사별 정산 내역은 정산 API가 준비되면 여기에 표로 보여드립니다.'

/** 04 진단 리포트 */
export function DiagnosisReportPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [tab, setTab] = useState<ReportTab>('sales')

  const report = useDiagnosisReport()
  const tabQueries = useDiagnosisTabQueries(tab)

  // TODO: 가게 주소는 GET /stores/me 연동 후 붙입니다.
  const userLabel = user ? `${user.representativeName} 사장님` : ''

  /** 탭마다 엔드포인트가 달라 로딩·실패·데이터 없음을 여기서 한 번에 처리합니다. */
  const renderTabPanel = () => {
    const query = tabQueries[tab]

    if (query.isPending)
      return <StatusCard loading loadingMessage="탭 데이터를 불러오는 중이에요..." />
    if (query.isError) {
      return <StatusCard errorMessage={query.error.message} onRetry={() => query.refetch()} />
    }

    switch (tab) {
      case 'sales': {
        const { data } = tabQueries.sales
        if (!data?.hasData) return <StatusCard errorMessage="아직 매출 데이터가 없어요" />
        return <SalesTabPanel points={toMonthlyAmounts(data)} note={toSalesNote(data)} />
      }
      case 'fixedCost': {
        const { data } = tabQueries.fixedCost
        if (!data?.hasData) return <StatusCard errorMessage="아직 고정비 데이터가 없어요" />
        return (
          <FixedCostTabPanel
            shares={toFixedCostShares(data.items)}
            rows={toFixedCostRows(data.items)}
            meta={toFixedCostMeta(data.items)}
            note={toFixedCostNote(data.items)}
          />
        )
      }
      case 'cashFlow': {
        const { data } = tabQueries.cashFlow
        if (!data?.hasData) return <StatusCard errorMessage="아직 현금흐름 데이터가 없어요" />
        return (
          <CashFlowTabPanel
            points={toMonthlyAmounts(data)}
            recent={toRecentCashFlow(data)}
            recentNote={toRecentCashFlowNote(data)}
            note={toCashFlowNote(data)}
          />
        )
      }
      case 'settlement': {
        const { data } = tabQueries.settlement
        if (!data?.hasData) return <StatusCard errorMessage="아직 정산 데이터가 없어요" />
        return <SettlementTabPanel stats={toSettlementStats(data)} note={SETTLEMENT_NOTE} />
      }
    }
  }

  const renderBody = () => {
    if (report.isPending) {
      return <StatusCard loading loadingMessage="진단 리포트를 불러오는 중이에요..." />
    }
    if (report.isError) {
      return <StatusCard errorMessage={report.error.message} onRetry={() => report.refetch()} />
    }

    const { data } = report
    if (!data.hasReport) {
      return (
        <EmptyReportCard
          description="첫 진단을 마치면 위험 점수와 원인 분석, 맞춤 처방을 여기서 볼 수 있어요."
          onStart={() => navigate(PATHS.onboardingStore)}
        />
      )
    }

    const summary = toReportSummary(data)

    return (
      <>
        {/* TODO: PDF 저장은 내보내기 API가 생기면 onSavePdf를 연결합니다. */}
        <ReportHeader report={summary} />

        <RiskScoreBar report={summary} />

        <div role="tablist" className="flex items-center gap-6 border-b border-border-default">
          {TABS.map(({ id, label }) => (
            <Tab key={id} active={tab === id} onClick={() => setTab(id)}>
              {label}
            </Tab>
          ))}
        </div>

        {renderTabPanel()}

        <CauseCard cause={toCause(data.causes)} level={summary.level} />

        <PrescriptionList
          prescriptions={toPrescriptions(data.prescriptions)}
          onExecute={(id) => navigate(prescriptionPath(id))}
        />
      </>
    )
  }

  return (
    <AppLayout title="우리 가게 진단" user={userLabel}>
      {renderBody()}
    </AppLayout>
  )
}
