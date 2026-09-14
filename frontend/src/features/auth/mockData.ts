import { toDigits } from '@/utils/format'

/** 로그인 화면에서 쓰는 데모 계정 타입입니다. API 연동 전까지 MOCK_ACCOUNTS가 이 형태를 채웁니다. */
export interface MockAccount {
  /** 하이픈을 뺀 사업자등록번호 10자리 */
  businessNumber: string
  password: string
  storeName: string
  ownerName: string
}

/*
 * 로그인 데모 계정입니다.
 * 로그인 API가 붙으면 findMockAccount 호출부만 요청으로 바꾸고 이 파일을 지웁니다.
 * 계정을 늘릴 때는 배열에 한 줄씩 추가합니다.
 */
export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    businessNumber: '1234567890',
    password: 'daegururu1',
    storeName: '영수네 국밥',
    ownerName: '김영수',
  },
]

/** 사업자등록번호는 입력값의 하이픈을 떼고 대조합니다. 없으면 undefined입니다. */
export function findMockAccount(
  businessNumber: string,
  password: string,
): MockAccount | undefined {
  const digits = toDigits(businessNumber)

  return MOCK_ACCOUNTS.find(
    (account) => account.businessNumber === digits && account.password === password,
  )
}
