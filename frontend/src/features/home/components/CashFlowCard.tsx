import { useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

import { AverageToggle } from '@/features/home/components/AverageToggle'
import type { CashFlowPoint } from '@/features/home/types'

export interface CashFlowCardProps {
  points: CashFlowPoint[]
  /** 동일 상권·업종 평균 순현금흐름(원) */
  average: number
  /** 차트 아래 경고 문구 */
  note: string
}

/** 최근 12개월 순현금흐름 추이 라인차트입니다. 업종 평균 참고선은 기본 해제입니다. */
export function CashFlowCard({ points, average, note }: CashFlowCardProps) {
  const [showAverage, setShowAverage] = useState(false)

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-s font-bold text-text-primary">현금흐름 추이</h2>
        <span className="text-caption text-text-tertiary">최근 12개월</span>
      </div>

      <AverageToggle label="업종 평균 참고선" value={showAverage} onChange={setShowAverage} />

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <CartesianGrid vertical={false} stroke="var(--color-chart-grid)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              // 12개월 라벨을 하나도 빠뜨리지 않고 모두 보여줍니다.
              interval={0}
              padding={{ left: 12, right: 12 }}
              tick={{ fill: 'var(--color-text-tertiary)', fontSize: 12 }}
            />
            {/* y축 눈금은 Figma에 없어 숨기고, 값 범위 계산에만 씁니다. */}
            <YAxis hide />
            {showAverage && (
              <ReferenceLine
                y={average}
                stroke="var(--color-chart-average)"
                strokeDasharray="4 4"
                label={{
                  value: '동일 상권·업종 평균',
                  position: 'insideTopRight',
                  fill: 'var(--color-text-secondary)',
                  fontSize: 12,
                }}
              />
            )}
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

      <p className="text-body-s text-status-danger">{note}</p>
    </section>
  )
}
