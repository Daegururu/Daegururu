import type { ReactNode } from 'react'

export interface InfoRow {
  label: string
  value: ReactNode
  /** 값 오른쪽에 붙는 버튼. 예: 비밀번호 [변경] */
  action?: ReactNode
}

export interface InfoCardProps {
  title: string
  /** 제목 오른쪽 요소. 예: 인증 상태 칩 */
  aside?: ReactNode
  rows: InfoRow[]
  /** 카드 아래 안내 문구 */
  note?: string
}

/** 10 오른쪽 열의 사업자 인증·계정 카드. 라벨은 왼쪽, 값은 오른쪽 끝에 붙입니다. */
export function InfoCard({ title, aside, rows, note }: InfoCardProps) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-heading-s font-bold text-text-primary">{title}</h3>
        {aside}
      </div>

      <dl className="flex flex-col">
        {rows.map(({ label, value, action }) => (
          <div
            key={label}
            className="flex min-h-11 items-center justify-between gap-4 border-b border-bg-subtle py-2 last:border-b-0"
          >
            <dt className="text-body-s text-text-tertiary">{label}</dt>
            <dd className="flex items-center gap-3 text-body-s font-medium text-text-primary">
              {value}
              {action}
            </dd>
          </div>
        ))}
      </dl>

      {note && <p className="text-caption text-text-tertiary">{note}</p>}
    </section>
  )
}
