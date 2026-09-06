import { useState, type ReactNode } from 'react'

import {
  EMPTY_STORE_INFO,
  OnboardingContext,
  type StoreInfo,
} from '@/features/onboarding/onboardingContext'

/** 온보딩 단계 사이에서 입력값을 유지합니다. */
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(EMPTY_STORE_INFO)

  return (
    <OnboardingContext.Provider value={{ storeInfo, setStoreInfo }}>
      {children}
    </OnboardingContext.Provider>
  )
}
