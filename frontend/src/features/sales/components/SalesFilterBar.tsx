import { useMemo } from 'react'

import { Button, Select } from '@/components/common'
import {
  CATEGORY_OPTIONS,
  SETTLEMENT_OPTIONS,
  type CategoryFilter,
  type SettlementFilter,
} from '@/features/sales/constants'
import { buildMonthOptions } from '@/features/sales/mapping'
import type { SalesMonth } from '@/features/sales/types'

export interface SalesFilters {
  month: SalesMonth
  category: CategoryFilter
  settlement: SettlementFilter
}

export interface SalesFilterBarProps {
  filters: SalesFilters
  onChange: (filters: SalesFilters) => void
  onExport: () => void
  onAdd: () => void
}

/** 필터 셀렉트 3개 + [내보내기] / [거래 추가]. 드롭다운 펼침(06d)은 Select 내부 상태입니다. */
export function SalesFilterBar({ filters, onChange, onExport, onAdd }: SalesFilterBarProps) {
  // 월 선택지는 이번 달 기준이라 화면이 떠 있는 동안 바뀌지 않습니다.
  const monthOptions = useMemo(() => buildMonthOptions(), [])

  return (
    <div className="flex items-center gap-3">
      <Select
        ariaLabel="월 선택"
        value={filters.month}
        options={monthOptions}
        onChange={(month) => onChange({ ...filters, month })}
      />
      <Select
        ariaLabel="구분"
        value={filters.category}
        options={CATEGORY_OPTIONS}
        onChange={(category) => onChange({ ...filters, category })}
      />
      <Select
        ariaLabel="정산상태"
        value={filters.settlement}
        options={SETTLEMENT_OPTIONS}
        onChange={(settlement) => onChange({ ...filters, settlement })}
      />

      <div className="flex-1" />

      <Button variant="secondary" size="sm" onClick={onExport}>
        내보내기
      </Button>
      <Button size="sm" onClick={onAdd}>
        거래 추가
      </Button>
    </div>
  )
}
