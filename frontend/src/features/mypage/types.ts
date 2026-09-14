/** 마이페이지(10 계열)에서 쓰는 타입입니다. API 연동 전까지는 mockData가 이 형태를 채웁니다. */

export type MypageTab = 'store' | 'notification'

/** 가게 정보 폼. 온보딩 StoreInfo와 같은 항목입니다. 연락처는 계정의 휴대폰을 읽기 전용으로 보여줍니다. */
export interface StoreProfile {
  name: string
  category: string
  address: string
  /** 개업일 YYYY-MM-DD */
  openedAt: string
}

export interface BusinessCertification {
  businessNumber: string
  ownerName: string
  /** 예: "음식점업 · 한식" */
  businessType: string
  /** 상태 칩 문구. 예: "인증 완료" */
  status: string
  note: string
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
