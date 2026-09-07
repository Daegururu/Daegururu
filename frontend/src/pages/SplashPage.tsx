import { useEffect } from 'react'
import { useNavigate } from 'react-router'

/** 브랜드 패널만 보여주는 시간(ms). 이후 로그인 화면으로 전환합니다. */
const HOLD_MS = 1200

/**
 * 00 스플래시. 화면은 AuthLayout의 브랜드 패널이 그대로 담당하고,
 * 여기서는 로그인으로 넘기는 일만 합니다.
 */
export function SplashPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // 뒤로 가기로 스플래시에 다시 갇히지 않도록 히스토리를 대체합니다.
    const timer = setTimeout(() => navigate('/login', { replace: true }), HOLD_MS)

    return () => clearTimeout(timer)
  }, [navigate])

  return null
}
