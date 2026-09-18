import type { NotificationSetting, NotificationValues } from './types'

/*
 * 알림 설정 목데이터입니다. 가게 정보·사업자 인증·계정은 GET /mypage로 채우고,
 * 알림 설정은 아직 API가 없어 항목과 초깃값을 여기 둡니다. 저장은 화면에서만 유지됩니다.
 */

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
  { key: 'sms', label: '문자', description: '회원가입 때 인증한 휴대폰 번호' },
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
