import { TableHeader, TableRow } from '@/components/common'
import type { TableCells } from '@/components/common'
import { ReportCard } from '@/features/diagnosis/components/ReportCard'
import {
  MOCK_SETTLEMENTS,
  MOCK_SETTLEMENT_META,
  MOCK_SETTLEMENT_NOTE,
} from '@/features/diagnosis/mockData'
import { formatWon } from '@/utils/format'

/** 정산 탭은 거래일자 대신 정산 예정일을 보여줍니다. */
const COLUMNS: TableCells = ['정산 예정일', '구분', '내용', '금액', '정산상태']

export function SettlementTabPanel() {
  return (
    <ReportCard title="카드사별 정산 내역" meta={MOCK_SETTLEMENT_META} note={MOCK_SETTLEMENT_NOTE}>
      <div role="table" className="overflow-hidden rounded-md border border-border-default">
        <TableHeader labels={COLUMNS} />
        {MOCK_SETTLEMENTS.map(({ date, kind, content, amount, status }) => (
          <TableRow
            key={`${date}-${content}`}
            cells={[date, kind, content, formatWon(amount), status]}
          />
        ))}
      </div>
    </ReportCard>
  )
}
