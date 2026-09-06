import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'

import { Button, Input, LogoMark, Modal } from '@/components/common'
import { useFormattedInput } from '@/hooks/useFormattedInput'
import { formatBusinessNumber } from '@/utils/format'
import { validateBusinessNumber, validateRequired } from '@/utils/validate'

/** 01 로그인 / 01-1 로그인 완료 */
export function LoginPage() {
  const navigate = useNavigate()
  const [businessNumber, setBusinessNumber] = useState('')
  const [password, setPassword] = useState('')
  const [businessNumberError, setBusinessNumberError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isCompleteModalOpen, setCompleteModalOpen] = useState(false)

  const businessNumberField = useFormattedInput(formatBusinessNumber, (value) => {
    setBusinessNumber(value)
    setBusinessNumberError('')
  })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const nextBusinessNumberError = validateBusinessNumber(businessNumber)
    const nextPasswordError = validateRequired(password, '비밀번호')

    setBusinessNumberError(nextBusinessNumberError)
    setPasswordError(nextPasswordError)

    if (nextBusinessNumberError || nextPasswordError) return

    // TODO: 로그인 API 연동. 사업자등록번호는 하이픈을 떼고 숫자만 전송합니다.
    setCompleteModalOpen(true)
  }

  return (
    <div className="flex min-h-screen items-stretch bg-bg-canvas">
      <aside className="relative hidden w-[560px] shrink-0 flex-col justify-center gap-5 overflow-hidden bg-brand-primary p-16 lg:flex">
        {/* 장식용 원. 브랜드 패널 밖으로 넘치는 부분은 잘립니다. */}
        <span
          aria-hidden
          className="absolute -top-[120px] left-[380px] size-[360px] rounded-full bg-white/6"
        />
        <span
          aria-hidden
          className="absolute -left-[80px] top-[760px] size-[220px] rounded-full bg-white/6"
        />

        <LogoMark size={76} />
        <p className="text-display-xl font-bold tracking-[-0.54px] text-text-inverse">대구르르</p>
        <p className="text-heading-m font-bold text-text-inverse">골목상권 데이터 기반 AI 컨설팅</p>
        <p className="text-body-l text-text-inverse/85">
          폐업 위험을 미리 진단하고,
          <br />
          필요한 자금을 제때 연결합니다.
        </p>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center bg-bg-surface px-6 py-16">
        <form onSubmit={handleSubmit} className="flex w-full max-w-[400px] flex-col gap-5">
          <h1 className="text-heading-l font-bold tracking-[-0.36px] text-text-primary">로그인</h1>
          <p className="text-body-m text-text-secondary">사업자등록번호로 로그인하세요</p>

          <Input
            label="사업자등록번호"
            placeholder="000-00-00000"
            value={businessNumber}
            {...businessNumberField}
            errorMessage={businessNumberError}
            inputMode="numeric"
            autoComplete="off"
            maxLength={12}
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setPasswordError('')
            }}
            errorMessage={passwordError}
            autoComplete="current-password"
          />

          <Button type="submit" className="w-full">
            로그인
          </Button>

          <p className="text-center text-caption text-text-tertiary">
            아직 회원이 아니신가요?{' '}
            <Link to="/signup" className="text-text-brand underline-offset-2 hover:underline">
              가게 등록하기
            </Link>
          </p>
        </form>
      </main>

      <Modal
        open={isCompleteModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        ariaLabel="로그인 완료"
      >
        <span
          aria-hidden
          className="flex size-14 items-center justify-center rounded-full bg-[#34c469] text-[26px] font-bold text-text-inverse"
        >
          ✓
        </span>
        <p className="text-heading-m font-bold text-text-primary">로그인 완료</p>
        <p className="text-center text-body-m text-text-secondary">
          영수네 국밥 사장님, 환영합니다!
          <br />
          대시보드로 이동해 오늘의 가게 상태를 확인해보세요.
        </p>
        <Button onClick={() => navigate('/')}>홈으로 이동</Button>
      </Modal>
    </div>
  )
}
