import { Navigate, Outlet, useLocation } from 'react-router'

import { PATHS } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'

/**
 * 로그인이 필요한 화면을 감싸는 라우트 가드입니다.
 * 토큰이 없으면 로그인으로 보내고, 401로 토큰이 지워져도 같은 경로로 빠져나갑니다.
 */
export function RequireAuth() {
  const token = useAuthStore((state) => state.token)
  const location = useLocation()

  if (!token) {
    return <Navigate to={PATHS.login} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
