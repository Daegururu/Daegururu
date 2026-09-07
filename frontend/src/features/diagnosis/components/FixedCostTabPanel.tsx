import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { ReportCard } from '@/features/diagnosis/components/ReportCard'
import {
  MOCK_FIXED_COST_META,
  MOCK_FIXED_COST_NOTE,
  MOCK_FIXED_COST_ROWS,
  MOCK_FIXED_COST_SHARES,
} from '@/features/diagnosis/mockData'
import { cn } from '@/utils/cn'
import { formatSignedRate, formatWon } from '@/utils/format'

const SERIES_COLORS = [
  'var(--color-chart-series-1)',
  'var(--color-chart-series-2)',
  'var(--color-chart-series-3)',
]

/** 증가는 빨강, 감소는 초록, 변화 없으면 회색으로 표시합니다. */
function deltaClass(delta: number): string {
  if (delta > 0) return 'text-status-danger'
  if (delta < 0) return 'text-status-safe'
  return 'text-text-secondary'
}

/** 고정비 탭. 도넛 + 항목별 표로 구성됩니다. */
export function FixedCostTabPanel() {
  return (
    <ReportCard title="고정비 구성" meta={MOCK_FIXED_COST_META} note={MOCK_FIXED_COST_NOTE}>
      <div className="flex items-center gap-9">
        <div className="size-[168px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOCK_FIXED_COST_SHARES}
                dataKey="ratio"
                nameKey="label"
                innerRadius={52}
                outerRadius={84}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                isAnimationActive={false}
              >
                {MOCK_FIXED_COST_SHARES.map((share, index) => (
                  <Cell key={share.label} fill={SERIES_COLORS[index % SERIES_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="flex w-[152px] shrink-0 flex-col gap-4">
          {MOCK_FIXED_COST_SHARES.map(({ label, ratio }, index) => (
            <li key={label} className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: SERIES_COLORS[index % SERIES_COLORS.length] }}
              />
              <span className="text-body-s text-text-primary">{label}</span>
              <span className="ml-auto text-body-s font-medium text-text-primary tabular-nums">
                {ratio}%
              </span>
            </li>
          ))}
        </ul>

        {/* 항목별 금액 표. 거래내역 표(5열)와 열 구성이 달라 여기서 직접 그립니다. */}
        <div className="min-w-0 flex-1" role="table">
          <div
            role="row"
            className="flex items-center gap-4 rounded-md bg-bg-subtle px-5 py-2.5 text-body-s font-medium text-text-secondary"
          >
            <span role="columnheader" className="min-w-0 flex-1">
              항목
            </span>
            <span role="columnheader" className="w-[120px] shrink-0 text-right">
              금액
            </span>
            <span role="columnheader" className="w-[72px] shrink-0 text-right">
              비중
            </span>
            <span role="columnheader" className="w-[88px] shrink-0 text-right">
              전월 대비
            </span>
          </div>

          {MOCK_FIXED_COST_ROWS.map(({ label, amount, ratio, delta }) => (
            <div
              key={label}
              role="row"
              className="flex items-center gap-4 border-b border-border-default px-5 py-3 text-body-s text-text-primary last:border-b-0"
            >
              <span role="cell" className="min-w-0 flex-1">
                {label}
              </span>
              <span role="cell" className="w-[120px] shrink-0 text-right font-medium tabular-nums">
                {formatWon(amount)}
              </span>
              <span role="cell" className="w-[72px] shrink-0 text-right tabular-nums">
                {ratio}%
              </span>
              <span
                role="cell"
                className={cn(
                  'w-[88px] shrink-0 text-right font-medium tabular-nums',
                  deltaClass(delta),
                )}
              >
                {formatSignedRate(delta)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ReportCard>
  )
}
