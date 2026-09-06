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
  { path: '/signup', element: <SignupPage /> },
  {
    // 온보딩 단계 사이에서 입력값을 유지하기 위해 provider로 감쌉니다.
    path: '/onboarding',
    element: (
      <OnboardingProvider>
        <Outlet />
      </OnboardingProvider>
    ),
    children: [
      { path: 'store', element: <StoreInfoPage /> },
      { path: 'confirm', element: <DiagnosisStartPage /> },
    ],
  },
])
