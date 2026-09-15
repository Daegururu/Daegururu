import { useNavigate } from 'react-router'

import { Button } from '@/components/common'
import { LogoBar } from '@/components/layout'
import { PATHS } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'

/** 없는 주소로 들어왔을 때. 로그인 상태면 홈, 아니면 로그인으로 보냅니다. */
export function NotFoundPage() {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)

  return (
    <div className="flex min-h-screen flex-col bg-bg-canvas">
      <LogoBar />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="flex w-full max-w-[480px] flex-col items-center gap-5 rounded-lg border border-border-default bg-bg-surface px-10 py-14 text-center shadow-sm">
          <span className="text-display-xl font-bold text-text-tertiary">404</span>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-heading-m font-bold text-text-primary">찾을 수 없는 페이지예요</h1>
            <p className="text-body-m text-text-secondary">
              주소가 바뀌었거나 잘못 입력됐을 수 있어요.
            </p>
          </div>
          <Button onClick={() => navigate(token ? PATHS.home : PATHS.login, { replace: true })}>
            {token ? '홈으로 가기' : '로그인으로 가기'}
          </Button>
        </div>
      </main>
    </div>
  )
}
