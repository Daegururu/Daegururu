import type {
  AccountInfo,
  BusinessCertification,
  NotificationSetting,
  NotificationValues,
  StoreProfile,
} from './types'

/*
 * 마이페이지 목데이터입니다.
 * 가게 정보는 온보딩에서 입력한 값을 그대로 가져온다는 전제이고, 사업자 인증은
 * 국세청 진위확인 API 연동 후 상태를 다시 조회합니다. 지금은 전부 고정값입니다.
 */

export const MOCK_STORE_PROFILE: StoreProfile = {
  name: '영수네 국밥',
  category: '한식 음식점업',
  address: '대구 중구 동성로2가 88-3',
  openedAt: '2023-06-14',
}

export const MOCK_CERTIFICATION: BusinessCertification = {
  businessNumber: '123-45-67890',
  ownerName: '김영수',
  businessType: '음식점업 · 한식',
  status: '인증 완료',
  note: '국세청 진위확인 기준 · 휴폐업 없음',
}

/** 휴대폰은 회원가입 때 인증한 010 번호입니다. 가게 정보의 연락처 칸에도 같은 값을 보여줍니다. */
export const MOCK_ACCOUNT: AccountInfo = {
  loginId: '123-45-67890',
  phone: '010-2847-1130',
}

/** 받을 알림 5개 */
export const NOTIFICATION_TYPES: NotificationSetting[] = [
  {
    key: 'riskScore',
    label: '위험 점수 변동',
    description: '진단 점수가 10점 이상 오르내리면 알려드립니다',
  },
  {
    key: 'settlement',
    label: '정산 입금',
    description: '정산 예정액이 실제로 입금되면 알려드립니다',
  },
  {
    key: 'newProgram',
    label: '신규 지원사업 매칭',
    description: '새 지원사업이 가게 조건에 맞으면 알려드립니다',
  },
  {
    key: 'documentDeadline',
    label: '서류 제출 마감',
    description: '신청한 지원사업의 서류 마감 3일 전에 알려드립니다',
  },
  {
    key: 'cashFlow',
    label: '현금흐름 경고',
    description: '순현금흐름이 2개월 연속 마이너스면 알려드립니다',
  },
]

/** 받는 방법 3개 */
export const NOTIFICATION_CHANNELS: NotificationSetting[] = [
  { key: 'push', label: '앱 알림', description: '대구르르 앱 푸시' },
  { key: 'sms', label: '문자', description: MOCK_ACCOUNT.phone },
  { key: 'quietHours', label: '야간 수신 안 함', description: '21:00~08:00에는 보내지 않습니다' },
]

export const MOCK_NOTIFICATION_VALUES: NotificationValues = {
  riskScore: true,
  settlement: true,
  newProgram: true,
  documentDeadline: true,
  cashFlow: false,
  push: true,
  sms: true,
  quietHours: true,
}

/** 상단바에 표시할 사용자 정보 */
export const MOCK_USER = '김영수 사장님 · 대구 중구 동성로'
