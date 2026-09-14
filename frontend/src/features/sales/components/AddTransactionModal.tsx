import { useState } from 'react'

import { Button, Checkbox, FormModal, Input, Select } from '@/components/common'
import { CATEGORY_LABEL, PAYMENT_METHOD_OPTIONS } from '@/features/sales/mockData'
import type { NewTransaction, TransactionCategory } from '@/features/sales/types'
import { cn } from '@/utils/cn'
import { toDigits } from '@/utils/format'

const CATEGORIES: TransactionCategory[] = ['sales', 'expense', 'other']

/** 구분별 [진단 반영] 안내 문구 */
const REFLECT_HINT: Record<TransactionCategory, string> = {
  sales: '현금 매출을 넣으면 매출 총액과 고정비 비중이 다시 계산되고, 다음 진단부터 반영됩니다.',
  expense: '현금 지출을 넣으면 고정비 총액과 비중이 다시 계산되고, 다음 진단부터 반영됩니다.',
  other: '기타 거래는 매출·고정비 계산에서 제외되지만 현금흐름에는 반영됩니다.',
}

const INITIAL: NewTransaction = {
  category: 'sales',
  date: '2026-08-29',
  amount: 0,
  content: '',
  method: '현금',
  reflectInDiagnosis: true,
}

export interface AddTransactionModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (transaction: NewTransaction) => void
}

/** 06b 거래 추가 모달. 카드·계좌로 자동 수집되지 않는 현금 거래를 직접 넣습니다. */
export function AddTransactionModal({ open, onClose, onSubmit }: AddTransactionModalProps) {
  const [form, setForm] = useState<NewTransaction>(INITIAL)
  const [amountText, setAmountText] = useState('')
  const [errors, setErrors] = useState<{ amount?: string; content?: string }>({})

  const update = <K extends keyof NewTransaction>(key: K, value: NewTransaction[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const reset = () => {
    setForm(INITIAL)
    setAmountText('')
    setErrors({})
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleAmountChange = (value: string) => {
    const digits = toDigits(value)
    setAmountText(digits ? `${Number(digits).toLocaleString('ko-KR')}원` : '')
    update('amount', Number(digits))
    setErrors((prev) => ({ ...prev, amount: undefined }))
  }

  const handleSubmit = () => {
    const nextErrors = {
      amount: form.amount > 0 ? undefined : '금액을 입력해주세요',
      content: form.content.trim() ? undefined : '내용을 입력해주세요',
    }
    setErrors(nextErrors)
    if (nextErrors.amount || nextErrors.content) return

    onSubmit(form)
    reset()
  }

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      title="거래 추가"
      description="카드·계좌로 자동 수집되지 않는 현금 매출과 현금 지출을 직접 넣습니다."
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleSubmit}>추가하기</Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-body-s font-medium text-text-secondary">구분</p>
          <div role="radiogroup" className="flex h-11 gap-1 rounded-md bg-bg-subtle p-1">
            {CATEGORIES.map((category) => {
              const active = form.category === category

              return (
                <button
                  key={category}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => update('category', category)}
                  className={cn(
                    'flex-1 rounded-[6px] text-body-s transition-colors',
                    active
                      ? 'bg-bg-surface font-medium text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary',
                  )}
                >
                  {CATEGORY_LABEL[category]}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="거래일자"
            type="date"
            value={form.date}
            onChange={(event) => update('date', event.target.value)}
          />
          <Input
            label="금액"
            placeholder="0원"
            inputMode="numeric"
            value={amountText}
            onChange={(event) => handleAmountChange(event.target.value)}
            errorMessage={errors.amount}
          />
        </div>

        <Input
          label="내용"
          placeholder="예) 현금 매출 (점심)"
          value={form.content}
          onChange={(event) => {
            update('content', event.target.value)
            setErrors((prev) => ({ ...prev, content: undefined }))
          }}
          errorMessage={errors.content}
        />

        <Select
          label="결제수단"
          fullWidth
          value={form.method}
          options={PAYMENT_METHOD_OPTIONS}
          onChange={(method) => update('method', method)}
        />

        {/* 진단 반영 안내. 체크박스 라벨은 두 줄이라 Checkbox의 children 대신 직접 구성합니다. */}
        <div className="flex items-start gap-2.5 rounded-md bg-brand-subtle px-4 py-3.5">
          <Checkbox
            className="mt-0.5"
            checked={form.reflectInDiagnosis}
            onChange={(event) => update('reflectInDiagnosis', event.target.checked)}
            aria-label="이 거래를 진단에 반영"
          />
          <div className="flex flex-col gap-0.5">
            <p className="text-body-m font-medium text-text-primary">이 거래를 진단에 반영</p>
            <p className="text-caption text-text-secondary">{REFLECT_HINT[form.category]}</p>
          </div>
        </div>
      </div>
    </FormModal>
  )
}
