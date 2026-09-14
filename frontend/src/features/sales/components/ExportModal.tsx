import { useState } from 'react'

import { Button, Checkbox, FormModal, Select } from '@/components/common'
import { EXPORT_PERIOD_OPTIONS } from '@/features/sales/mockData'
import type { SalesMonth } from '@/features/sales/types'

type IncludeKey = 'sales' | 'expense' | 'scheduled'

const INCLUDE_ITEMS: { key: IncludeKey; label: string; caption: string }[] = [
  { key: 'sales', label: '매출 내역', caption: '카드 · 현금 · 배달' },
  { key: 'expense', label: '고정비·지출 내역', caption: '인건비 · 임대료 · 공과금' },
  { key: 'scheduled', label: '정산 예정 내역', caption: '미정산 3,180,000원' },
]

export interface ExportModalProps {
  open: boolean
  /** 필터 바에서 고른 달. 기간 셀렉트의 초기값입니다. */
  month: SalesMonth
  onClose: () => void
  onExport: () => void
}

/** 06c 내보내기 모달. 형식은 PDF 요약본으로 고정되어 고를 수 없습니다. */
export function ExportModal({ open, month, onClose, onExport }: ExportModalProps) {
  const [period, setPeriod] = useState<SalesMonth>(month)
  const [includes, setIncludes] = useState<Record<IncludeKey, boolean>>({
    sales: true,
    expense: true,
    scheduled: true,
  })

  const hasSelection = Object.values(includes).some(Boolean)

  return (
    <FormModal
      open={open}
      onClose={onClose}
      size="md"
      title="내보내기"
      description="선택한 기간의 거래 내역을 파일로 만듭니다."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button disabled={!hasSelection} onClick={onExport}>
            내보내기
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <Select
          label="기간"
          fullWidth
          value={period}
          options={EXPORT_PERIOD_OPTIONS}
          onChange={setPeriod}
        />

        <div className="flex flex-col gap-3">
          <p className="text-body-s font-medium text-text-secondary">포함할 내용</p>
          <ul className="flex flex-col gap-2">
            {INCLUDE_ITEMS.map(({ key, label, caption }) => (
              <li key={key} className="flex items-center justify-between gap-4">
                <Checkbox
                  checked={includes[key]}
                  onChange={(event) =>
                    setIncludes((prev) => ({ ...prev, [key]: event.target.checked }))
                  }
                >
                  <span className="text-body-m text-text-primary">{label}</span>
                </Checkbox>
                <span className="text-caption text-text-tertiary">{caption}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-body-s font-medium text-text-secondary">형식</p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-body-m font-medium text-text-primary">PDF 요약본</span>
            <span className="text-caption text-text-tertiary">정책자금 신청 첨부용</span>
          </div>
          <p className="text-caption text-text-secondary">
            PDF 요약본은 정책자금 신청 서류로 바로 첨부할 수 있습니다. 거래 내역은 항상 PDF
            요약본으로만 내보낼 수 있습니다.
          </p>
        </div>
      </div>
    </FormModal>
  )
}
