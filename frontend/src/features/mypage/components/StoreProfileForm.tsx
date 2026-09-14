import { useState, type FormEvent } from 'react'

import { Button, Input } from '@/components/common'
import type { StoreProfile } from '@/features/mypage/types'
import { formatBusinessPeriod } from '@/utils/date'
import { validateRequired } from '@/utils/validate'

type FieldKey = keyof StoreProfile

const EMPTY_ERRORS: Record<FieldKey, string> = {
  name: '',
  category: '',
  address: '',
  openedAt: '',
}

export interface StoreProfileFormProps {
  profile: StoreProfile
  /** 계정의 휴대폰 번호. 회원가입 때 인증한 값이라 여기서는 보여주기만 합니다. */
  phone: string
  onSave: (profile: StoreProfile) => void
}

/** 10 가게 정보 탭 왼쪽 폼. [취소]는 마지막 저장값으로 되돌립니다. */
export function StoreProfileForm({ profile, phone, onSave }: StoreProfileFormProps) {
  const [form, setForm] = useState<StoreProfile>(profile)
  const [errors, setErrors] = useState<Record<FieldKey, string>>(EMPTY_ERRORS)

  const handleChange = (field: FieldKey) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleCancel = () => {
    setForm(profile)
    setErrors(EMPTY_ERRORS)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const nextErrors: Record<FieldKey, string> = {
      name: validateRequired(form.name, '상호명'),
      category: validateRequired(form.category, '업종'),
      address: validateRequired(form.address, '사업장 주소'),
      openedAt: validateRequired(form.openedAt, '개업일'),
    }
    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) return
    onSave(form)
  }

  const period = formatBusinessPeriod(form.openedAt)

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm"
    >
      <h3 className="text-heading-s font-bold text-text-primary">가게 정보</h3>

      <Input
        label="상호명"
        helperText="간판에 쓰는 이름"
        value={form.name}
        onChange={(event) => handleChange('name')(event.target.value)}
        errorMessage={errors.name}
      />
      <Input
        label="업종"
        helperText="업종에 따라 지원사업이 달라집니다"
        value={form.category}
        onChange={(event) => handleChange('category')(event.target.value)}
        errorMessage={errors.category}
      />
      <Input
        label="사업장 주소"
        helperText="지역 기반 정책자금 매칭에 사용"
        value={form.address}
        onChange={(event) => handleChange('address')(event.target.value)}
        errorMessage={errors.address}
      />
      <Input
        label="개업일"
        type="date"
        helperText={period ? `사업기간 ${period}` : '사업기간 조건 심사에 사용됩니다'}
        value={form.openedAt}
        onChange={(event) => handleChange('openedAt')(event.target.value)}
        errorMessage={errors.openedAt}
      />
      {/* 회원가입 때 인증한 010 번호라 여기서는 바꿀 수 없습니다. 계정 카드의 휴대폰과 같은 값입니다. */}
      <Input
        label="연락처"
        helperText="알림 수신 번호 · 회원가입 때 인증한 휴대폰 번호"
        value={phone}
        disabled
        readOnly
      />

      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" onClick={handleCancel}>
          취소
        </Button>
        <Button type="submit">저장</Button>
      </div>
    </form>
  )
}
