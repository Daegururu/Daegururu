import { createContext, useContext } from 'react'

import type { CertificateInfo } from '@/types/certificate'

export interface StoreInfo {
  /** 상호명 */
  name: string
  /** 업종 */
  category: string
  /** 업태. 사업자등록증의 업태란 (예: 음식점업) */
  businessType: string
  /** 종목. 사업자등록증의 종목란 (예: 한식) */
  businessCategory: string
  /** 사업장 주소 */
  address: string
  /** 개업일 (YYYY-MM-DD) */
  openedAt: string
}

export const EMPTY_STORE_INFO: StoreInfo = {
  name: '',
  category: '',
  businessType: '',
  businessCategory: '',
  address: '',
  openedAt: '',
}

export interface OnboardingContextValue {
  storeInfo: StoreInfo
  setStoreInfo: (info: StoreInfo) => void
  /**
   * 회원가입에서 업로드한 사업자등록증의 인식 결과. 업로드 전이면 null입니다.
   * StoreInfo에 자리가 없는 사업자등록번호·대표자명·유효기간을 뒤 단계에서 쓰기 위해 원본을 남겨둡니다.
   */
  certificate: CertificateInfo | null
  setCertificate: (info: CertificateInfo | null) => void
}

export const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding은 OnboardingProvider 안에서만 사용할 수 있습니다')
  }
  return context
}
