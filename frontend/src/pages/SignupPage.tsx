import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'

import { Button, Checkbox, FileDropzone, Input } from '@/components/common'
import { LogoBar } from '@/components/layout'
import { useFormattedInput } from '@/hooks/useFormattedInput'
import { formatBusinessNumber, formatPhoneNumber } from '@/utils/format'
import {
  validateBusinessNumber,
  validatePassword,
  validatePhoneNumber,
  validateRequired,
} from '@/utils/validate'

/** PDF에서 자동 인식되는 값. API 연동 전까지는 고정 값을 사용합니다. */
const RECOGNIZED_INFO = {
  businessNumber: '514-23-88190',
  ownerName: '김영수',
}

type AgreementKey = 'terms' | 'privacy' | 'marketing'

type FieldKey = 'businessNumber' | 'ownerName' | 'phone' | 'password'

const AGREEMENTS: { key: AgreementKey; label: string }[] = [
  { key: 'terms', label: '서비스 이용약관 (필수)' },
  { key: 'privacy', label: '개인정보 수집·이용 동의 (필수)' },
  { key: 'marketing', label: '마케팅 정보 수신 (선택)' },
]

/** 01c 회원가입 · 가게 등록하기 / 01c-2 정보 확인 (같은 화면의 업로드 전후 상태) */
export function SignupPage() {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [businessNumber, setBusinessNumber] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [agreements, setAgreements] = useState<Record<AgreementKey, boolean>>({
    terms: false,
    privacy: false,
    marketing: false,
  })

  const [errors, setErrors] = useState<Record<FieldKey, string>>({
    businessNumber: '',
    ownerName: '',
    phone: '',
    password: '',
  })

  const isUploaded = file !== null
  const isAllAgreed = AGREEMENTS.every(({ key }) => agreements[key])
  const isRequiredAgreed = agreements.terms && agreements.privacy
  const canSubmit =
    isUploaded && Boolean(phone.trim()) && Boolean(password.trim()) && isRequiredAgreed

  /** 입력을 고치는 동안에는 해당 필드의 에러를 지웁니다. */
  const clearError = (field: FieldKey) => setErrors((prev) => ({ ...prev, [field]: '' }))

  const businessNumberField = useFormattedInput(formatBusinessNumber, (value) => {
    setBusinessNumber(value)
    clearError('businessNumber')
  })
  const phoneField = useFormattedInput(formatPhoneNumber, (value) => {
    setPhone(value)
    clearError('phone')
  })

  const handleFileSelect = (selected: File) => {
    setFile(selected)
    // TODO: OCR API 연동. 현재는 인식 결과를 고정 값으로 채웁니다.
    setBusinessNumber(RECOGNIZED_INFO.businessNumber)
    setOwnerName(RECOGNIZED_INFO.ownerName)
  }

  const handleFileClear = () => {
    setFile(null)
    setBusinessNumber('')
    setOwnerName('')
  }

  const toggleAll = (checked: boolean) => {
    setAgreements({ terms: checked, privacy: checked, marketing: checked })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return

    const nextErrors: Record<FieldKey, string> = {
      businessNumber: validateBusinessNumber(businessNumber),
      ownerName: validateRequired(ownerName, '대표자명'),
      phone: validatePhoneNumber(phone),
      password: validatePassword(password),
    }
    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) return

    // TODO: 회원가입 API 연동. 번호는 하이픈을 떼고 숫자만 전송합니다.
    // { businessNumber: toDigits(businessNumber), phone: toDigits(phone), ownerName, password }
    navigate('/onboarding/store')
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-canvas">
      <LogoBar />

      <main className="flex flex-1 justify-center px-6 py-[104px]">
        <form
          onSubmit={handleSubmit}
          className="flex h-fit w-full max-w-[718px] flex-col gap-6 rounded-lg border border-border-default bg-bg-surface p-12 shadow-sm"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-heading-m font-bold text-text-primary">가게 등록하기</h1>
            <p className="text-body-m text-text-secondary">
              소상공인 확인서(PDF)를 업로드하면 사업자 정보를 자동으로 채워드립니다.
              <br />
              대구 지역에 사업장이 있는 개인·법인 사업자만 가입할 수 있습니다.
            </p>
          </div>

          <FileDropzone
            label="소상공인 확인서 (PDF)"
            file={file}
            onFileSelect={handleFileSelect}
            onFileClear={handleFileClear}
            title="소상공인 확인서를 업로드하세요"
            description="업로드하면 사업자등록번호·대표자명이 자동으로 입력됩니다"
            helperText="PDF 형식만 가능 · 국세청 소상공인확인서 발급 페이지에서 발급받을 수 있습니다"
          />

          <Input
            label="사업자등록번호"
            placeholder="PDF 업로드 후 자동 입력됩니다"
            helperText="업로드한 확인서로 사업자 상태까지 함께 확인합니다"
            value={businessNumber}
            {...businessNumberField}
            errorMessage={errors.businessNumber}
            disabled={!isUploaded}
            inputMode="numeric"
            autoComplete="off"
            maxLength={12}
          />

          <Input
            label="대표자명"
            placeholder="PDF 업로드 후 자동 입력됩니다"
            helperText="사업자등록증상 대표자 이름"
            value={ownerName}
            onChange={(event) => {
              setOwnerName(event.target.value)
              clearError('ownerName')
            }}
            errorMessage={errors.ownerName}
            disabled={!isUploaded}
            autoComplete="off"
          />

          <div className="flex items-end gap-3">
            <Input
              label="휴대폰 번호"
              placeholder="010-0000-0000"
              value={phone}
              {...phoneField}
              errorMessage={errors.phone}
              inputMode="numeric"
              autoComplete="tel"
              maxLength={13}
            />
            <Button variant="secondary" className="shrink-0">
              인증번호 받기
            </Button>
          </div>

          <Input
            label="비밀번호"
            type="password"
            placeholder="영문·숫자 조합 8자 이상"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              clearError('password')
            }}
            errorMessage={errors.password}
            autoComplete="new-password"
          />

          <hr className="border-border-default" />

          <div className="flex flex-col gap-4">
            <Checkbox
              emphasized
              checked={isAllAgreed}
              onChange={(e) => toggleAll(e.target.checked)}
            >
              전체 동의
            </Checkbox>

            {AGREEMENTS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between pl-7">
                <Checkbox
                  checked={agreements[key]}
                  onChange={(event) =>
                    setAgreements((prev) => ({ ...prev, [key]: event.target.checked }))
                  }
                >
                  {label}
                </Checkbox>
                <button type="button" className="text-caption text-text-tertiary hover:underline">
                  보기
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              이전
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              가입하고 시작하기
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
