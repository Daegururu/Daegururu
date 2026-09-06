import { toDigits } from '@/utils/format'

/** 사업자등록번호는 하이픈을 뺀 10자리입니다. */
export function validateBusinessNumber(value: string): string {
  const digits = toDigits(value)

  if (!digits) return '사업자등록번호를 입력해주세요'
  if (digits.length !== 10) return '사업자등록번호 10자리를 모두 입력해주세요'
  return ''
}

/** 휴대폰 번호는 하이픈을 뺀 10~11자리이고 0으로 시작합니다. */
export function validatePhoneNumber(value: string): string {
  const digits = toDigits(value)

  if (!digits) return '휴대폰 번호를 입력해주세요'
  if (!digits.startsWith('0')) return '휴대폰 번호 형식이 올바르지 않습니다'
  if (digits.length < 10 || digits.length > 11) return '휴대폰 번호를 정확히 입력해주세요'
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

/** 이름은 공백을 제외하고 한 글자 이상이어야 합니다. */
export function validateRequired(value: string, label: string): string {
  if (!value.trim()) return `${label}을(를) 입력해주세요`
  return ''
}
