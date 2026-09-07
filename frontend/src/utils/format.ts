/** 숫자를 제외한 모든 문자를 제거합니다. 서버로 보낼 때 하이픈을 떼는 용도로도 씁니다. */
export function toDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/** 사업자등록번호를 000-00-00000 형태로 만듭니다. (10자리) */
export function formatBusinessNumber(value: string): string {
  const digits = toDigits(value).slice(0, 10)

  if (digits.length <= 3) return digits
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
}

/** 휴대폰 번호를 010-0000-0000 형태로 만듭니다. (10~11자리) */
export function formatPhoneNumber(value: string): string {
  const digits = toDigits(value).slice(0, 11)

  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  // 10자리(011 등)는 3-3-4, 11자리는 3-4-4로 끊습니다.
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

/** 금액을 1,840,000원 형태로 만듭니다. */
export function formatWon(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

/** 증감률을 +18.0% / 0.0% / -1.2% 형태로 만듭니다. 단위는 %p처럼 바꿔 쓸 수 있습니다. */
export function formatSignedRate(value: number, unit = '%'): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}${unit}`
}
