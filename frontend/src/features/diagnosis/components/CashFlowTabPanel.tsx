import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { ReportCard } from '@/features/diagnosis/components/ReportCard'
import {
  MOCK_CASH_FLOW_NOTE,
  MOCK_MONTHLY_CASH_FLOW,
  MOCK_RECENT_CASH_FLOW,
  MOCK_RECENT_CASH_FLOW_NOTE,
} from '@/features/diagnosis/mockData'
import { cn } from '@/utils/cn'
import { formatWon } from '@/utils/format'

/** 현금흐름 탭. 라인차트 옆에 최근 3개월 요약을 붙입니다. */
export function CashFlowTabPanel() {
  return (
    <ReportCard title="월별 순현금흐름" meta="단위: 만원 · 최근 12개월" note={MOCK_CASH_FLOW_NOTE}>
      <div className="flex items-center gap-8">
        <div className="h-[220px] min-w-0 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={MOCK_MONTHLY_CASH_FLOW}
              margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
            >
              <CartesianGrid vertical={false} stroke="var(--color-chart-grid)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                interval={0}
                padding={{ left: 12, right: 12 }}
                tick={{ fill: 'var(--color-text-tertiary)', fontSize: 12 }}
              />
              <YAxis hide />
              <Line
                type="linear"
                dataKey="amount"
                stroke="var(--color-chart-line)"
                strokeWidth={2}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex w-[300px] shrink-0 flex-col gap-3 rounded-md bg-bg-subtle p-5">
          <p className="text-caption text-text-tertiary">최근 3개월 순현금흐름</p>

          <dl className="flex flex-col gap-2.5">
            {MOCK_RECENT_CASH_FLOW.map(({ month, amount }) => (
              <div key={month} className="flex items-center justify-between gap-4">
                <dt className="text-body-m text-text-primary">{month}</dt>
                <dd
                  className={cn(
                    'text-body-l font-bold tabular-nums',
                    amount < 0 ? 'text-status-danger' : 'text-status-safe',
                  )}
                >
                  {amount > 0 ? `+${formatWon(amount)}` : formatWon(amount)}
                </dd>
              </div>
            ))}
          </dl>

          <p className="border-t border-border-default pt-3 text-caption text-text-secondary">
            {MOCK_RECENT_CASH_FLOW_NOTE}
          </p>
        </div>
      </div>
    </ReportCard>
  )
}
