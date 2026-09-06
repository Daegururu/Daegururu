import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { uploadCertificate } from '@/apis/certificates'
import { Button, Checkbox, FileDropzone, Input, Modal, TermsModal } from '@/components/common'
import type { TermsKey } from '@/constants/terms'
import { LogoBar } from '@/components/layout'
import { certificateToStoreInfo } from '@/features/onboarding/certificateMapping'
import { EMPTY_STORE_INFO, useOnboarding } from '@/features/onboarding/onboardingContext'
import { useFormattedInput } from '@/hooks/useFormattedInput'
import { formatBusinessNumber, formatPhoneNumber, toDigits } from '@/utils/format'
import {
  validateBusinessNumber,
  validatePassword,
  validatePhoneNumber,
  validateRequired,
  validateVerificationCode,
} from '@/utils/validate'

type FieldKey = 'businessNumber' | 'ownerName' | 'phone' | 'verificationCode' | 'password'

const UPLOAD_HELPER_TEXT =
  'PDF 형식만 가능 · 국세청 소상공인확인서 발급 페이지에서 발급받을 수 있습니다'
const UPLOAD_PENDING_TEXT = '확인서를 읽고 있습니다. 스캔본은 조금 더 걸릴 수 있어요'

const AGREEMENTS: { key: TermsKey; label: string }[] = [
  { key: 'terms', label: '서비스 이용약관 (필수)' },
  { key: 'privacy', label: '개인정보 수집·이용 동의 (필수)' },
  { key: 'marketing', label: '마케팅 정보 수신 (선택)' },
]

/** 01c 회원가입 · 가게 등록하기 / 01c-2 정보 확인 (같은 화면의 업로드 전후 상태) */
export function SignupPage() {
  const navigate = useNavigate()
  const { setStoreInfo, setCertificate } = useOnboarding()
  const [file, setFile] = useState<File | null>(null)
  const [businessNumber, setBusinessNumber] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isCodeSent, setCodeSent] = useState(false)
  const [openedTerms, setOpenedTerms] = useState<TermsKey | null>(null)
  const [isFailureModalOpen, setFailureModalOpen] = useState(false)
  const [agreements, setAgreements] = useState<Record<TermsKey, boolean>>({
    terms: false,
    privacy: false,
    marketing: false,
  })

  const [errors, setErrors] = useState<Record<FieldKey, string>>({
    businessNumber: '',
    ownerName: '',
    phone: '',
    verificationCode: '',
    password: '',
  })

  const upload = useMutation({
    mutationFn: uploadCertificate,
    onSuccess: (certificate, selected) => {
      // 사업자 정보를 하나도 읽지 못했으면 인식 실패로 봅니다.
      // 인식에 실패한 파일은 등록하지 않아 업로드 전 상태가 유지됩니다.
      if (!certificate.business_number && !certificate.representative_name) {
        setFailureModalOpen(true)
        return
      }

      setFile(selected)
      // 서버가 하이픈 없이 보내도 formatBusinessNumber가 000-00-00000 형태로 맞춰줍니다.
      setBusinessNumber(formatBusinessNumber(certificate.business_number ?? ''))
      setOwnerName(certificate.representative_name ?? '')

      // 이 화면에서 쓰지 않는 상호명·업종·주소는 온보딩 가게 정보로 넘겨 다시 입력하지 않게 합니다.
      setCertificate(certificate)
      setStoreInfo(certificateToStoreInfo(certificate))
    },
  })

  // 사업자 정보는 PDF에서 읽어온 값만 사용합니다. 업로드 전에는 입력할 수 없습니다.
  const isUploaded = file !== null
  const isAllAgreed = AGREEMENTS.every(({ key }) => agreements[key])
  const isRequiredAgreed = agreements.terms && agreements.privacy
  const canSubmit =
    isUploaded &&
    !upload.isPending &&
    Boolean(phone.trim()) &&
    Boolean(verificationCode.trim()) &&
    Boolean(password.trim()) &&
    isRequiredAgreed

  const uploadHelperText = upload.isPending ? UPLOAD_PENDING_TEXT : UPLOAD_HELPER_TEXT

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

  const handleFileClear = () => {
    setFile(null)
    setBusinessNumber('')
    setOwnerName('')
    // 온보딩으로 넘길 값도 함께 비웁니다.
    setCertificate(null)
    setStoreInfo(EMPTY_STORE_INFO)
    upload.reset()
  }

  /** 인식 실패 모달에서 [다시 업로드]를 누르면 업로드 전 상태로 되돌립니다. */
  const handleRetryUpload = () => {
    setFailureModalOpen(false)
    handleFileClear()
  }

  /** 약관 모달에서 [확인]을 누르면 해당 약관에 동의 처리합니다. */
  const handleTermsConfirm = (key: TermsKey) => {
    setAgreements((prev) => ({ ...prev, [key]: true }))
    setOpenedTerms(null)
  }

  /** TODO: 인증번호 발송 API 연동 */
  const handleSendCode = () => {
    const phoneError = validatePhoneNumber(phone)
    if (phoneError) {
      setErrors((prev) => ({ ...prev, phone: phoneError }))
      return
    }
    setCodeSent(true)
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
      verificationCode: validateVerificationCode(verificationCode),
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

          <div className="flex flex-col gap-2">
            <FileDropzone
              label="소상공인 확인서 (PDF)"
              file={file}
              onFileSelect={(selected) => upload.mutate(selected)}
              onFileClear={handleFileClear}
              title="소상공인 확인서를 업로드하세요"
              description="업로드하면 사업자등록번호·대표자명이 자동으로 입력됩니다"
              // 실패 문구를 따로 띄우므로 안내 문구는 비웁니다.
              helperText={upload.isError ? undefined : uploadHelperText}
            />
            {upload.isError && (
              <p role="alert" className="text-caption text-status-danger">
                {upload.error.message}
              </p>
            )}
          </div>

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
            <Button variant="secondary" className="shrink-0" onClick={handleSendCode}>
              인증번호 받기
            </Button>
          </div>

          {isCodeSent && (
            <div className="flex items-end gap-3">
              <Input
                label="인증번호"
                placeholder="6자리 숫자 입력"
                helperText="문자로 받은 인증번호를 입력하세요 · 유효시간 3:00"
                value={verificationCode}
                onChange={(event) => {
                  setVerificationCode(toDigits(event.target.value).slice(0, 6))
                  clearError('verificationCode')
                }}
                errorMessage={errors.verificationCode}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
              />
              <Button variant="secondary" className="shrink-0">
                확인
              </Button>
            </div>
          )}

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
                <button
                  type="button"
                  onClick={() => setOpenedTerms(key)}
                  className="text-caption text-text-tertiary hover:underline"
                >
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

      <Modal
        open={isFailureModalOpen}
        onClose={handleRetryUpload}
        ariaLabel="문서를 인식하지 못했습니다"
      >
        <span
          aria-hidden
          className="flex size-14 items-center justify-center rounded-full bg-status-warn text-[28px] font-bold text-text-inverse"
        >
          !
        </span>
        <p className="text-heading-m font-bold text-text-primary">문서를 인식하지 못했습니다</p>
        <p className="max-w-[274px] text-center text-body-m text-text-secondary">
          업로드하신 소상공인 확인서에서 사업자 정보를 읽어오지 못했어요. 파일이 선명한지 확인하고
          다시 업로드해주세요.
        </p>
        <Button onClick={handleRetryUpload}>다시 업로드</Button>
      </Modal>

      <TermsModal
        termsKey={openedTerms}
        onConfirm={handleTermsConfirm}
        onClose={() => setOpenedTerms(null)}
      />
    </div>
  )
}
