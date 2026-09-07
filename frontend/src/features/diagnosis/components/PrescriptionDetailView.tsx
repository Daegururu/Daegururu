import { useState } from 'react'

import { Button, Checkbox } from '@/components/common'
import type { PrescriptionDetail } from '@/features/diagnosis/types'
import { cn } from '@/utils/cn'

const STATE_TONE = {
  danger: 'text-status-danger',
  brand: 'text-text-brand',
  neutral: 'text-text-secondary',
} as const

export interface PrescriptionDetailViewProps {
  detail: PrescriptionDetail
  /** 실행 계획 저장. 저장 API가 없는 동안에는 넘기지 않아 버튼이 비활성됩니다. */
  onSave?: () => void
  /** AI 도우미로 이동 */
  onAskAi?: () => void
}

/** 04e 처방 실행 화면 본문입니다. 왼쪽은 실행 내용, 오른쪽은 요약과 유의사항입니다. */
export function PrescriptionDetailView({ detail, onSave, onAskAi }: PrescriptionDetailViewProps) {
  // 체크 상태는 화면 안에서만 씁니다. 저장 API가 붙으면 서버 상태로 옮깁니다.
  const [checked, setChecked] = useState<string[]>([])

  const toggle = (title: string) =>
    setChecked((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title],
    )

  return (
    <div className="grid grid-cols-[1fr_364px] items-start gap-6">
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
          <h3 className="text-heading-s font-bold text-text-primary">지금 어떤 상태인가요</h3>

          <div className="grid grid-cols-3 gap-3">
            {detail.currentState.map(({ label, value, caption, tone }) => (
              <div key={label} className="flex flex-col gap-1 rounded-md bg-bg-subtle p-4">
                <span className="text-caption text-text-tertiary">{label}</span>
                <span className="text-number-l font-bold text-text-primary">{value}</span>
                <span className={cn('text-caption', STATE_TONE[tone])}>{caption}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
          <h3 className="text-heading-s font-bold text-text-primary">이렇게 바꾸면 됩니다</h3>

          <ul className="flex flex-col">
            {detail.steps.map(({ title, description }) => (
              <li
                key={title}
                className="flex gap-3 border-b border-border-default py-4 first:pt-0 last:border-b-0 last:pb-0"
              >
                <Checkbox
                  className="mt-0.5 self-start"
                  checked={checked.includes(title)}
                  onChange={() => toggle(title)}
                  aria-label={title}
                />
                <div className="flex flex-col gap-1">
                  <p className="text-body-m font-medium text-text-primary">{title}</p>
                  <p className="text-body-s text-text-secondary">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
          <h3 className="text-heading-s font-bold text-text-primary">적용하면 이렇게 바뀝니다</h3>

          <div role="table">
            <div
              role="row"
              className="flex items-center gap-4 border-b border-border-default pb-2.5 text-caption text-text-tertiary"
            >
              <span role="columnheader" className="min-w-0 flex-1">
                항목
              </span>
              <span role="columnheader" className="w-[120px] shrink-0 text-right">
                현재
              </span>
              <span role="columnheader" className="w-[120px] shrink-0 text-right">
                조정 후
              </span>
              <span role="columnheader" className="w-[120px] shrink-0 text-right">
                차이
              </span>
            </div>

            {detail.effects.map(({ label, before, after, diff }) => (
              <div
                key={label}
                role="row"
                className="flex items-center gap-4 border-b border-border-default py-3 text-body-s last:border-b-0"
              >
                <span role="cell" className="min-w-0 flex-1 text-text-primary">
                  {label}
                </span>
                <span
                  role="cell"
                  className="w-[120px] shrink-0 text-right text-text-secondary tabular-nums"
                >
                  {before}
                </span>
                <span
                  role="cell"
                  className="w-[120px] shrink-0 text-right font-medium text-text-primary tabular-nums"
                >
                  {after}
                </span>
                <span
                  role="cell"
                  className="w-[120px] shrink-0 text-right font-medium text-status-safe tabular-nums"
                >
                  {diff}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
          <h3 className="text-heading-s font-bold text-text-primary">실행 요약</h3>

          <dl className="flex flex-col gap-2.5">
            {detail.summary.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <dt className="text-body-s text-text-secondary">{label}</dt>
                <dd className="text-body-s font-medium text-text-primary">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-3">
            <Button disabled={!onSave} onClick={onSave}>
              실행 계획 저장
            </Button>
            <Button variant="secondary" disabled={!onAskAi} onClick={onAskAi}>
              AI에게 물어보기
            </Button>
          </div>
        </section>

        <section className="flex overflow-hidden rounded-lg border border-border-default bg-status-warn-bg shadow-sm">
          <span aria-hidden className="w-1 shrink-0 bg-status-warn" />

          <div className="flex flex-1 flex-col gap-3 p-6">
            <h3 className="text-heading-s font-bold text-status-warn">확인하세요</h3>
            {detail.notices.map((text) => (
              <p key={text} className="text-body-s text-text-secondary">
                {text}
              </p>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
