import { useState, type FormEvent } from 'react'

import { Button, Input } from '@/components/common'
import type { StoreProfile } from '@/features/mypage/types'
import { formatBusinessPeriod } from '@/utils/date'
import { validateRequired } from '@/utils/validate'

type FieldKey = keyof StoreProfile

const EMPTY_ERRORS: Record<FieldKey, string> = {
  name: '',
  category: '',
  businessType: '',
  businessCategory: '',
  address: '',
  openedAt: '',
}

export interface StoreProfileFormProps {
  profile: StoreProfile
  /** 저장이 끝나면 resolve, 실패하면 reject합니다. 실패 문구는 submitError로 따로 받습니다. */
  onSave: (profile: StoreProfile) => Promise<void>
  /** 저장 요청 중이면 true. 버튼을 잠급니다. */
  saving?: boolean
  /** 저장 실패 문구. 버튼 위에 보여줍니다. */
  submitError?: string
}

/**
 * 10 가게 정보 탭 왼쪽 카드. 평소에는 라벨·값 줄로만 보여주고 [수정]을 누르면 입력 폼으로 바뀝니다.
 * [취소]는 마지막 저장값으로 되돌리고 보기 상태로 돌아갑니다.
 * 저장 뒤 서버 값이 바뀌면 호출하는 쪽이 key를 바꿔 새로 그립니다.
 */
export function StoreProfileForm({
  profile,
  onSave,
  saving = false,
  submitError = '',
}: StoreProfileFormProps) {
  const [form, setForm] = useState<StoreProfile>(profile)
  const [errors, setErrors] = useState<Record<FieldKey, string>>(EMPTY_ERRORS)
  const [editing, setEditing] = useState(false)

  const handleChange = (field: FieldKey) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleCancel = () => {
    setForm(profile)
    setErrors(EMPTY_ERRORS)
    setEditing(false)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const nextErrors: Record<FieldKey, string> = {
      name: validateRequired(form.name, '상호명'),
      category: validateRequired(form.category, '업종'),
      businessType: validateRequired(form.businessType, '업태'),
      businessCategory: validateRequired(form.businessCategory, '종목'),
      address: validateRequired(form.address, '사업장 주소'),
      openedAt: validateRequired(form.openedAt, '개업일'),
    }
    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) return

    try {
      await onSave(form)
      setEditing(false)
    } catch {
      // 실패 문구는 submitError로 보여주고, 고치던 값은 그대로 둡니다.
    }
  }

  const period = formatBusinessPeriod(form.openedAt)

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm"
    >
      <h3 className="text-heading-s font-bold text-text-primary">가게 정보</h3>

      {editing ? (
        <>
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
          {/* 업태·종목은 사업자등록증에 나란히 적혀 있어 한 줄에 둡니다. */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="업태"
              helperText="사업자등록증의 업태란"
              value={form.businessType}
              onChange={(event) => handleChange('businessType')(event.target.value)}
              errorMessage={errors.businessType}
            />
            <Input
              label="종목"
              helperText="사업자등록증의 종목란"
              value={form.businessCategory}
              onChange={(event) => handleChange('businessCategory')(event.target.value)}
              errorMessage={errors.businessCategory}
            />
          </div>
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
        </>
      ) : (
        /* 보기 상태. 입력 폼과 같은 자리에 라벨 위·값 아래로 두어 [수정]을 눌러도 위치가 튀지 않습니다. */
        <div className="flex flex-col gap-5">
          <ReadField label="상호명" value={profile.name} />
          <ReadField label="업종" value={profile.category} />
          <div className="grid grid-cols-2 gap-4">
            <ReadField label="업태" value={profile.businessType} />
            <ReadField label="종목" value={profile.businessCategory} />
          </div>
          <ReadField label="사업장 주소" value={profile.address} />
          <ReadField
            label="개업일"
            value={profile.openedAt}
            helperText={period ? `사업기간 ${period}` : undefined}
          />
        </div>
      )}

      {submitError && (
        <p role="alert" className="text-caption text-status-danger">
          {submitError}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        {editing ? (
          <>
            <Button variant="ghost" onClick={handleCancel} disabled={saving}>
              취소
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={() => setEditing(true)}>
            수정
          </Button>
        )}
      </div>
    </form>
  )
}

interface ReadFieldProps {
  label: string
  value: string
  helperText?: string
}

/** 보기 상태의 한 항목. Input과 같은 라벨·간격을 써서 수정 상태로 바뀔 때 레이아웃이 유지됩니다. */
function ReadField({ label, value, helperText }: ReadFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-body-s font-medium text-text-secondary">{label}</p>
      <p className="border-b border-border-default pb-2 text-body-m text-text-primary">
        {value || '-'}
      </p>
      {helperText && <p className="text-caption text-text-secondary">{helperText}</p>}
    </div>
  )
}
