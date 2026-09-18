import type { MypageResponse } from '@/types/mypage'
import { formatBusinessNumber, formatPhoneNumber } from '@/utils/format'

import type { AccountInfo, BusinessCertification, StoreProfile } from './types'

/** GET /mypage 응답을 화면 타입 세 개로 나눕니다. */
export function toMypage(response: MypageResponse): {
  profile: StoreProfile
  certification: BusinessCertification
  account: AccountInfo
} {
  const { store, business_verification, account } = response

  return {
    profile: {
      name: store.business_name,
      category: store.industry_name,
      businessType: store.business_type ?? '',
      businessCategory: store.business_category ?? '',
      address: store.business_address,
      openedAt: store.open_date,
    },
    certification: {
      businessNumber: formatBusinessNumber(business_verification.business_reg_no),
      ownerName: business_verification.representative_name,
      // 업태·종목 컬럼이 생기기 전에 등록된 가게는 비어 있을 수 있어 빈 쪽은 빼고 붙입니다.
      businessType: [business_verification.business_type, business_verification.business_category]
        .filter(Boolean)
        .join(' · '),
    },
    account: {
      loginId: formatBusinessNumber(account.login_id),
      phone: formatPhoneNumber(account.phone_number),
    },
  }
}
