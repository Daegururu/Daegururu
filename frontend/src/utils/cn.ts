type ClassValue = string | false | null | undefined

/** 조건부 클래스명을 하나의 문자열로 합칩니다. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
