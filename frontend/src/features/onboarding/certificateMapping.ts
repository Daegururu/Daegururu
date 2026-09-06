import type { StoreInfo } from '@/features/onboarding/onboardingContext'
import type { CertificateInfo } from '@/types/certificate'

/**
 * 사업자등록증 인식 결과를 온보딩 가게 정보로 옮깁니다.
 *
 * - 개업일(openedAt)에 대응하는 응답 필드가 없습니다.
 *   valid_from은 확인서 유효기간의 시작일이라 개업일이 아니므로 쓰지 않고 비워둡니다.
 * - 인식하지 못한 항목(null)은 빈 값으로 두어 사용자가 직접 채우게 합니다.
 */
export function certificateToStoreInfo(certificate: CertificateInfo): StoreInfo {
  return {
    name: certificate.company_name ?? '',
    category: certificate.main_business ?? '',
    address: certificate.business_address ?? '',
    openedAt: '',
  }
}
