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

      {/* 도넛과 범례가 카드 안에서 세로 가운데에 오도록 남는 높이를 이 줄이 흡수합니다. */}
      <div className="flex flex-1 items-center gap-10">
        <div className="size-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                dataKey="ratio"
                nameKey="label"
                innerRadius={54}
                outerRadius={88}
                startAngle={90}
                endAngle={-270}
                // 조각 사이를 카드 배경색으로 갈라 경계를 만듭니다.
                paddingAngle={2}
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

        {/* 범례는 남는 폭을 모두 차지하고, 비중은 오른쪽 끝에 맞춰 세로로 정렬합니다. */}
        <ul className="flex w-[168px] shrink-0 flex-col gap-4">
          {items.map(({ label, ratio, averageRatio }, index) => (
            <li key={label} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: SERIES_COLORS[index % SERIES_COLORS.length] }}
                />
                <span className="text-body-s text-text-primary">{label}</span>
                <span className="ml-auto text-body-s font-medium text-text-primary tabular-nums">
                  {ratio}%
                </span>
              </div>
              {showAverage && (
                <span className="self-end text-caption text-text-tertiary tabular-nums">
                  업종평균 {averageRatio}%
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-body-s text-text-secondary">{note}</p>
    </section>
  )
}
