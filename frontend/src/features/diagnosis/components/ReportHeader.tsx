import { Button } from '@/components/common'
import type { ReportSummary } from '@/features/diagnosis/types'

export interface ReportHeaderProps {
  report: ReportSummary
  /** PDF 저장. 기능이 없는 동안에는 넘기지 않아 버튼이 비활성됩니다. */
  onSavePdf?: () => void
}

/** 리포트 제목과 생성 정보, PDF 저장 버튼입니다. */
export function ReportHeader({ report, onSavePdf }: ReportHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-heading-l font-bold text-text-primary">{report.title}</h2>
        <p className="text-caption text-text-tertiary">{report.meta}</p>
      </div>

      <Button variant="secondary" size="sm" disabled={!onSavePdf} onClick={onSavePdf}>
        PDF 저장
      </Button>
    </div>
  )
}
