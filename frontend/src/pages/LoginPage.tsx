import { useState, type FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'

import { postLogin } from '@/apis/auth'
import { Button, Input, Modal } from '@/components/common'
import { useFormattedInput } from '@/hooks/useFormattedInput'
import { PATHS } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'
import { formatBusinessNumber, toDigits } from '@/utils/format'
import { validateBusinessNumber, validateRequired } from '@/utils/validate'

/** 01 로그인 / 01-1 로그인 완료 */
export function LoginPage() {
  const navigate = useNavigate()
  const [businessNumber, setBusinessNumber] = useState('')
  const [password, setPassword] = useState('')
  const [businessNumberError, setBusinessNumberError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  // 로그인에 성공한 대표자명. 완료 모달 문구에 씁니다.
  const [loggedInName, setLoggedInName] = useState<string | null>(null)
  const setAuth = useAuthStore((state) => state.setAuth)

  const login = useMutation({
    mutationFn: postLogin,
    onSuccess: (response) => {
      setAuth(response)
      setLoggedInName(response.representative_name)
    },
    onError: (error) => {
      // 번호·비밀번호 중 어느 쪽이 틀렸는지 알려주지 않기 위해 비밀번호 아래에만 표시합니다.
      // 서버 연결 실패 같은 오류도 같은 자리에 보여줍니다.
      setPasswordError(error.message)
    },
  })

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

    // 사업자등록번호는 회원가입 때와 같이 하이픈을 떼고 숫자만 보냅니다.
    login.mutate({ business_reg_no: toDigits(businessNumber), password })
  }

  return (
    <>
      {/* 브랜드 패널이 왼쪽으로 줄어드는 동안 폼이 오른쪽에서 따라 들어옵니다. */}
      <form
        onSubmit={handleSubmit}
        className="animate-form-in flex w-full max-w-[400px] flex-col gap-5"
      >
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

        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? '로그인 중...' : '로그인'}
        </Button>

        <p className="text-center text-caption text-text-tertiary">
          아직 회원이 아니신가요?{' '}
          <Link to="/signup" className="text-text-brand underline-offset-2 hover:underline">
            가게 등록하기
          </Link>
        </p>
      </form>

      <Modal
        open={loggedInName !== null}
        onClose={() => setLoggedInName(null)}
        ariaLabel="로그인 완료"
      >
        <span
          aria-hidden
          className="flex size-14 items-center justify-center rounded-full bg-status-safe text-[26px] font-bold text-text-inverse"
        >
          ✓
        </span>
        <p className="text-heading-m font-bold text-text-primary">로그인 완료</p>
        <p className="text-center text-body-m text-text-secondary">
          {loggedInName} 사장님, 환영합니다!
          <br />
          대시보드로 이동해 오늘의 가게 상태를 확인해보세요.
        </p>
        <Button onClick={() => navigate(PATHS.home)}>홈으로 이동</Button>
      </Modal>
    </>
  )
}
