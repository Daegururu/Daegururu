import { Navigate, Outlet } from 'react-router'

import { PATHS } from '@/routes/paths'
import { useAuthStore } from '@/stores/authStore'

/**
 * 스플래시·로그인처럼 로그인 전에만 보는 화면을 감싸는 가드입니다.
 * 이미 로그인해 있으면(로그인 뒤 뒤로 가기 등) 홈으로 보냅니다.
 * 회원가입은 가입 직후 로그인 상태가 되어 온보딩으로 넘어가야 해서 여기에 넣지 않습니다.
 */
export function RedirectIfAuth() {
  const user = useAuthStore((state) => state.user)

  if (user) return <Navigate to={PATHS.home} replace />

  return <Outlet />
}
