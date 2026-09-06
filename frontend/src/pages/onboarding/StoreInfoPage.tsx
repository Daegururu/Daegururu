import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'

import { Button, Input } from '@/components/common'
import { OnboardingLayout } from '@/components/layout'
import { useOnboarding, type StoreInfo } from '@/features/onboarding/onboardingContext'
import { validateRequired } from '@/utils/validate'

type FieldKey = keyof StoreInfo

const EMPTY_ERRORS: Record<FieldKey, string> = {
  name: '',
  category: '',
  address: '',
  openedAt: '',
}

/** 02a 온보딩 · 가게 정보 */
export function StoreInfoPage() {
  const navigate = useNavigate()
  const { storeInfo, setStoreInfo } = useOnboarding()
  const [form, setForm] = useState<StoreInfo>(storeInfo)
  const [errors, setErrors] = useState<Record<FieldKey, string>>(EMPTY_ERRORS)

  const handleChange = (field: FieldKey) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
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

    setStoreInfo(form)
    navigate('/onboarding/confirm')
  }

  return (
    <OnboardingLayout currentStep={1}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-m font-bold text-text-primary">가게 정보를 알려주세요</h1>
          <p className="text-body-m text-text-secondary">
            사업자등록증에 적힌 그대로 입력해주세요. 진단 정확도가 올라갑니다.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <Input
            label="상호명"
            placeholder="예) 영수네 국밥"
            helperText="간판에 쓰는 이름으로 입력하세요"
            value={form.name}
            onChange={(event) => handleChange('name')(event.target.value)}
            errorMessage={errors.name}
          />
          <Input
            label="업종"
            placeholder="예) 한식 음식점업"
            helperText="업종에 따라 지원사업이 달라집니다"
            value={form.category}
            onChange={(event) => handleChange('category')(event.target.value)}
            errorMessage={errors.category}
          />
          <Input
            label="사업장 주소"
            placeholder="예) 대구 중구 동성로2가"
            helperText="지역 기반 정책자금 매칭에 사용됩니다"
            value={form.address}
            onChange={(event) => handleChange('address')(event.target.value)}
            errorMessage={errors.address}
          />
          <Input
            label="개업일"
            type="date"
            helperText="사업기간 조건 심사에 사용됩니다"
            value={form.openedAt}
            onChange={(event) => handleChange('openedAt')(event.target.value)}
            errorMessage={errors.openedAt}
          />
        </div>

        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/login')}>
            이전
          </Button>
          <Button type="submit">다음 단계</Button>
        </div>
      </form>
    </OnboardingLayout>
  )
}
