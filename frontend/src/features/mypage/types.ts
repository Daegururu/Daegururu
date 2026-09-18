/** 마이페이지(10 계열)에서 쓰는 타입입니다. 응답을 이 형태로 옮기는 건 mapping.ts가 합니다. */

export type MypageTab = 'store' | 'notification'

/** 가게 정보 폼. 온보딩 StoreInfo와 같은 항목입니다. 휴대폰은 계정 카드에서만 보여줍니다. */
export interface StoreProfile {
  name: string
  category: string
  /** 업태. 예: 음식점업 */
  businessType: string
  /** 종목. 예: 한식 */
  businessCategory: string
  address: string
  /** 개업일 YYYY-MM-DD */
  openedAt: string
}

export interface BusinessCertification {
  /** 000-00-00000 */
  businessNumber: string
  ownerName: string
  /** 업태·종목을 한 줄로. 예: "음식점업 · 한식". 둘 다 없으면 빈 문자열 */
  businessType: string
}

export interface AccountInfo {
  /** 로그인 아이디. 사업자등록번호로 고정됩니다. */
  loginId: string
  /** 회원가입 때 인증한 010 휴대폰 번호. 마이페이지에서는 바꿀 수 없습니다. */
  phone: string
}

export type NotificationKey =
  | 'riskScore'
  | 'settlement'
  | 'newProgram'
  | 'documentDeadline'
  | 'cashFlow'
  | 'push'
  | 'sms'
  | 'quietHours'

export interface NotificationSetting {
  key: NotificationKey
  label: string
  description: string
}

export type NotificationValues = Record<NotificationKey, boolean>
