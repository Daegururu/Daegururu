import type { ReactNode } from 'react'

export interface ReportCardProps {
  title: string
  /** 오른쪽 위 보조 문구. 예: "단위: 만원 · 최근 12개월" */
  meta?: string
  /** 카드 아래 해설 문구 */
  note?: string
  children: ReactNode
}

/** 탭 안에서 쓰는 카드 껍데기입니다. 제목·보조문구·해설 위치를 통일합니다. */
export function ReportCard({ title, meta, note, children }: ReportCardProps) {
  return (
    <section className="flex flex-col gap-5 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-heading-s font-bold text-text-primary">{title}</h3>
        {meta && <span className="text-caption text-text-tertiary">{meta}</span>}
      </div>

      {children}

      {note && <p className="text-body-s text-text-secondary">{note}</p>}
    </section>
  )
}
