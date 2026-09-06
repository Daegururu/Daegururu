import { createContext, useContext } from 'react'

export interface StoreInfo {
  /** 상호명 */
  name: string
  /** 업종 */
  category: string
  /** 사업장 주소 */
  address: string
  /** 개업일 (YYYY-MM-DD) */
  openedAt: string
}

export const EMPTY_STORE_INFO: StoreInfo = {
  name: '',
  category: '',
  address: '',
  openedAt: '',
}

export interface OnboardingContextValue {
  storeInfo: StoreInfo
  setStoreInfo: (info: StoreInfo) => void
}

export const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding은 OnboardingProvider 안에서만 사용할 수 있습니다')
  }
  return context
}
