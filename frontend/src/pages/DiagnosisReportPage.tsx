import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Tab } from '@/components/common'
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
  MOCK_CAUSE,
  MOCK_PRESCRIPTIONS,
  MOCK_REPORT,
  MOCK_USER,
} from '@/features/diagnosis/mockData'
import type { ReportTab } from '@/features/diagnosis/types'
import { prescriptionPath } from '@/routes/paths'

/** 탭 4개. Figma 04 / 04b / 04c / 04d는 이 탭 상태만 다른 같은 화면입니다. */
const TABS: { id: ReportTab; label: string }[] = [
  { id: 'sales', label: '매출 추이' },
  { id: 'fixedCost', label: '고정비' },
  { id: 'cashFlow', label: '현금흐름' },
  { id: 'settlement', label: '정산' },
]

const PANELS: Record<ReportTab, () => React.JSX.Element> = {
  sales: SalesTabPanel,
  fixedCost: FixedCostTabPanel,
  cashFlow: CashFlowTabPanel,
  settlement: SettlementTabPanel,
}

/** 04 진단 리포트 */
export function DiagnosisReportPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<ReportTab>('sales')

  const Panel = PANELS[tab]

  return (
    <AppLayout title="우리 가게 진단" user={MOCK_USER}>
      {/* TODO: 진단 결과·거래내역 API 연동. 지금은 전부 목데이터입니다. */}
      <ReportHeader report={MOCK_REPORT} />

      <RiskScoreBar report={MOCK_REPORT} />

      <div role="tablist" className="flex items-center gap-6 border-b border-border-default">
        {TABS.map(({ id, label }) => (
          <Tab key={id} active={tab === id} onClick={() => setTab(id)}>
            {label}
          </Tab>
        ))}
      </div>

      <Panel />

      <CauseCard cause={MOCK_CAUSE} />

      <PrescriptionList
        prescriptions={MOCK_PRESCRIPTIONS}
        onExecute={(id) => navigate(prescriptionPath(id))}
      />
    </AppLayout>
  )
}
