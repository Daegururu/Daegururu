import { createBrowserRouter, Outlet } from 'react-router'

import App from '@/App'
import { OnboardingProvider } from '@/features/onboarding/OnboardingProvider'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { DiagnosisStartPage } from '@/pages/onboarding/DiagnosisStartPage'
import { StoreInfoPage } from '@/pages/onboarding/StoreInfoPage'

// 화면을 추가할 때 이 배열에 { path, element }를 넣습니다.
export const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/login', element: <LoginPage /> },
  {
    // 가입 단계에서 읽은 사업자등록증 정보를 온보딩까지 이어가기 위해
    // 회원가입과 온보딩을 같은 provider로 묶습니다.
    element: (
      <OnboardingProvider>
        <Outlet />
      </OnboardingProvider>
    ),
    children: [
      { path: '/signup', element: <SignupPage /> },
      { path: '/onboarding/store', element: <StoreInfoPage /> },
      { path: '/onboarding/confirm', element: <DiagnosisStartPage /> },
    ],
  },
])
