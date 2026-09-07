import { useState, type ReactNode } from 'react'

import {
  EMPTY_STORE_INFO,
  OnboardingContext,
  type StoreInfo,
} from '@/features/onboarding/onboardingContext'
import type { CertificateInfo } from '@/types/certificate'

/** 회원가입부터 온보딩 단계까지 입력값을 유지합니다. */
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(EMPTY_STORE_INFO)
  const [certificate, setCertificate] = useState<CertificateInfo | null>(null)

  return (
    <OnboardingContext.Provider value={{ storeInfo, setStoreInfo, certificate, setCertificate }}>
      {children}
    </OnboardingContext.Provider>
  )
}
