import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { ReportCard } from '@/features/diagnosis/components/ReportCard'
import { MOCK_MONTHLY_SALES, MOCK_SALES_NOTE } from '@/features/diagnosis/mockData'

/** 매출 추이 탭. 최근 3개월은 다른 색으로 강조합니다. */
export function SalesTabPanel() {
  return (
    <ReportCard title="월별 매출 추이" meta="단위: 만원 · 최근 12개월" note={MOCK_SALES_NOTE}>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_MONTHLY_SALES} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <CartesianGrid vertical={false} stroke="var(--color-chart-grid)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              interval={0}
              tick={{ fill: 'var(--color-text-tertiary)', fontSize: 12 }}
            />
            {/* y축 눈금은 Figma에 없어 숨기고, 막대 높이 계산에만 씁니다. */}
            <YAxis hide />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]} isAnimationActive={false}>
              {/* 최근 3개월만 연한 파랑으로 구분합니다. 차트는 브랜드색과 무관하게 blue 계열입니다. */}
              {MOCK_MONTHLY_SALES.map(({ month, highlighted }) => (
                <Cell
                  key={month}
                  fill={highlighted ? 'var(--color-chart-series-2)' : 'var(--color-chart-series-1)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ReportCard>
  )
}
