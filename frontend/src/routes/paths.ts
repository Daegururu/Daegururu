/*
 * 화면 경로 상수입니다. 경로 문자열을 코드 곳곳에 흩어두지 않기 위해 여기서만 정의합니다.
 * 아직 화면이 없는 경로도 미리 적어 두고, 화면이 만들어지면 라우터에 등록합니다.
 */
export const PATHS = {
  splash: '/',
  login: '/login',
  signup: '/signup',
  onboardingStore: '/onboarding/store',
  onboardingConfirm: '/onboarding/confirm',
  home: '/home',
  /** 04 진단 리포트 */
  diagnosis: '/diagnosis',
  /** 04e 처방 실행. prescriptionPath(id)로 실제 경로를 만듭니다. */
  prescription: '/diagnosis/prescriptions/:id',
  /** 05 AI 도우미 */
  assistant: '/assistant',
  /** 06 매출·정산. 거래 추가·내보내기 모달과 필터 드롭다운은 이 화면 안의 상태입니다. */
  sales: '/sales',
  /** 07 금융상품 추천 */
  finance: '/finance',
  /** 08 상품 상세. financeDetailPath(id)로 실제 경로를 만듭니다. */
  financeDetail: '/finance/:id',
  /** 09 신청 플로우. financeApplyPath(id)로 실제 경로를 만듭니다. */
  financeApply: '/finance/:id/apply',
  /** 09b 신청 완료. financeApplyDonePath(id)로 실제 경로를 만듭니다. */
  financeApplyDone: '/finance/:id/apply/done',
  /** 10 마이페이지. 알림 설정 탭과 비밀번호 변경 모달은 이 화면 안의 상태입니다. */
  mypage: '/mypage',
} as const

export type Path = (typeof PATHS)[keyof typeof PATHS]

/**
 * 라우터에 등록된 경로입니다. 화면을 붙일 때마다 여기에 추가하면
 * 사이드바·버튼이 자동으로 활성화됩니다.
 */
export const IMPLEMENTED_PATHS: ReadonlySet<string> = new Set([
  PATHS.splash,
  PATHS.login,
  PATHS.signup,
  PATHS.onboardingStore,
  PATHS.onboardingConfirm,
  PATHS.home,
  PATHS.diagnosis,
  PATHS.prescription,
  PATHS.assistant,
  PATHS.sales,
  PATHS.finance,
  PATHS.financeDetail,
  PATHS.financeApply,
  PATHS.financeApplyDone,
  PATHS.mypage,
])

/** 처방 실행 화면의 실제 경로를 만듭니다. */
export function prescriptionPath(id: string): string {
  return PATHS.prescription.replace(':id', id)
}

/** 상품 상세 화면의 실제 경로를 만듭니다. */
export function financeDetailPath(id: string): string {
  return PATHS.financeDetail.replace(':id', id)
}

/** 신청 플로우 화면의 실제 경로를 만듭니다. */
export function financeApplyPath(id: string): string {
  return PATHS.financeApply.replace(':id', id)
}

/** 신청 완료 화면의 실제 경로를 만듭니다. */
export function financeApplyDonePath(id: string): string {
  return PATHS.financeApplyDone.replace(':id', id)
}

/** 해당 경로의 화면이 이미 만들어졌는지 확인합니다. */
export function isImplemented(path: string): boolean {
  return IMPLEMENTED_PATHS.has(path)
}
