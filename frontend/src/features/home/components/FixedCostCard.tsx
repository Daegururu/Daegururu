import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { AverageToggle } from '@/features/home/components/AverageToggle'
import type { FixedCostItem } from '@/features/home/types'

const SERIES_COLORS = [
  'var(--color-chart-series-1)',
  'var(--color-chart-series-2)',
  'var(--color-chart-series-3)',
]

export interface FixedCostCardProps {
  items: FixedCostItem[]
  /** 도넛 아래 요약 문구 */
  note: string
}

/** 고정비 구성 도넛차트입니다. 업종 평균 비교는 기본 해제입니다. */
export function FixedCostCard({ items, note }: FixedCostCardProps) {
  const [showAverage, setShowAverage] = useState(false)

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
      <h2 className="text-heading-s font-bold text-text-primary">고정비 구성</h2>

      <AverageToggle label="업종 평균 비교" value={showAverage} onChange={setShowAverage} />

      <div className="flex items-center gap-8">
        <div className="size-[200px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                dataKey="ratio"
                nameKey="label"
                innerRadius={62}
                outerRadius={100}
                startAngle={90}
                endAngle={-270}
                paddingAngle={0}
                stroke="none"
                isAnimationActive={false}
              >
                {items.map((item, index) => (
                  <Cell key={item.label} fill={SERIES_COLORS[index % SERIES_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="flex flex-col gap-3.5">
          {items.map(({ label, ratio, averageRatio }, index) => (
            <li key={label} className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: SERIES_COLORS[index % SERIES_COLORS.length] }}
                />
                <span className="text-body-s text-text-primary">{label}</span>
                <span className="text-body-s font-medium text-text-primary">{ratio}%</span>
              </div>
              {showAverage && (
                <span className="pl-5 text-caption text-text-tertiary">
                  (업종평균 {averageRatio}%)
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 도넛과 너무 붙어 보여 아래로 내려 둡니다. */}
      <p className="mt-3 text-body-s text-text-secondary">{note}</p>
    </section>
  )
}
