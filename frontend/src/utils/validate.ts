import { toDigits } from '@/utils/format'

/** 사업자등록번호는 하이픈을 뺀 10자리입니다. */
export function validateBusinessNumber(value: string): string {
  const digits = toDigits(value)

  if (!digits) return '사업자등록번호를 입력해주세요'
  if (digits.length !== 10) return '사업자등록번호 10자리를 모두 입력해주세요'
  return ''
}

/**
 * 휴대폰 번호는 하이픈을 뺀 010으로 시작하는 11자리입니다.
 * 인증번호를 SMS로 보내야 하므로 유선·인터넷 전화번호는 받지 않습니다.
 * 011·016·017·018·019는 2021년 6월 서비스가 종료되어 제외합니다.
 */
export function validatePhoneNumber(value: string): string {
  const digits = toDigits(value)

  if (!digits) return '휴대폰 번호를 입력해주세요'
  if (!digits.startsWith('010')) return '010으로 시작하는 휴대폰 번호를 입력해주세요'
  if (digits.length !== 11) return '휴대폰 번호 11자리를 모두 입력해주세요'
  return ''
}

/** 비밀번호는 영문과 숫자를 모두 포함한 8자 이상입니다. */
export function validatePassword(value: string): string {
  if (!value) return '비밀번호를 입력해주세요'
  if (value.length < 8) return '비밀번호는 8자 이상이어야 합니다'
  if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
    return '영문과 숫자를 모두 포함해주세요'
  }
  return ''
}

/** 인증번호는 6자리 숫자입니다. */
export function validateVerificationCode(value: string): string {
  const digits = toDigits(value)

  if (!digits) return '인증번호를 입력해주세요'
  if (digits.length !== 6) return '인증번호 6자리를 입력해주세요'
  return ''
}

/** 이름은 공백을 제외하고 한 글자 이상이어야 합니다. */
export function validateRequired(value: string, label: string): string {
  if (!value.trim()) return `${label}을(를) 입력해주세요`
  return ''
}
