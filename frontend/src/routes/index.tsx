import { createBrowserRouter, Outlet } from 'react-router'

import { AuthLayout } from '@/components/layout'
import { OnboardingProvider } from '@/features/onboarding/OnboardingProvider'
import { AssistantPage } from '@/pages/AssistantPage'
import { DiagnosisReportPage } from '@/pages/DiagnosisReportPage'
import { FinanceApplyDonePage } from '@/pages/FinanceApplyDonePage'
import { FinanceApplyPage } from '@/pages/FinanceApplyPage'
import { FinanceDetailPage } from '@/pages/FinanceDetailPage'
import { FinancePage } from '@/pages/FinancePage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { MyPage } from '@/pages/MyPage'
import { PrescriptionPage } from '@/pages/PrescriptionPage'
import { SalesPage } from '@/pages/SalesPage'
import { SignupPage } from '@/pages/SignupPage'
import { SplashPage } from '@/pages/SplashPage'
import { DiagnosisStartPage } from '@/pages/onboarding/DiagnosisStartPage'
import { StoreInfoPage } from '@/pages/onboarding/StoreInfoPage'
import { PATHS } from '@/routes/paths'

// 화면을 추가할 때 이 배열에 { path, element }를 넣고,
// paths.ts의 IMPLEMENTED_PATHS에도 같은 경로를 추가합니다.
export const router = createBrowserRouter([
  {
    // 스플래시와 로그인은 브랜드 패널을 공유합니다. 같은 레이아웃 아래 두어야
    // 패널이 다시 그려지지 않고 전체 화면 → 왼쪽 패널로 이어서 줄어듭니다.
    element: <AuthLayout />,
    children: [
      { path: PATHS.splash, element: <SplashPage /> },
      { path: PATHS.login, element: <LoginPage /> },
    ],
  },
  {
    // 가입 단계에서 읽은 사업자등록증 정보를 온보딩까지 이어가기 위해
    // 회원가입과 온보딩을 같은 provider로 묶습니다.
    element: (
      <OnboardingProvider>
        <Outlet />
      </OnboardingProvider>
    ),
    children: [
      { path: PATHS.signup, element: <SignupPage /> },
      { path: PATHS.onboardingStore, element: <StoreInfoPage /> },
      { path: PATHS.onboardingConfirm, element: <DiagnosisStartPage /> },
    ],
  },
  { path: PATHS.home, element: <HomePage /> },
  { path: PATHS.diagnosis, element: <DiagnosisReportPage /> },
  { path: PATHS.prescription, element: <PrescriptionPage /> },
  { path: PATHS.assistant, element: <AssistantPage /> },
  { path: PATHS.sales, element: <SalesPage /> },
  { path: PATHS.finance, element: <FinancePage /> },
  { path: PATHS.financeDetail, element: <FinanceDetailPage /> },
  { path: PATHS.financeApply, element: <FinanceApplyPage /> },
  { path: PATHS.financeApplyDone, element: <FinanceApplyDonePage /> },
  { path: PATHS.mypage, element: <MyPage /> },
])
