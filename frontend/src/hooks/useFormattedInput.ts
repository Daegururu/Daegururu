import { useLayoutEffect, useRef, type ChangeEvent } from 'react'

/** 문자열 안의 숫자 개수를 셉니다. */
function countDigits(value: string): number {
  return value.replace(/\D/g, '').length
}

/** 포맷된 문자열에서 숫자 count개를 지난 직후의 위치를 찾습니다. */
function positionAfterDigits(formatted: string, count: number): number {
  if (count === 0) return 0

  let seen = 0
  for (let index = 0; index < formatted.length; index += 1) {
    if (/\d/.test(formatted[index])) {
      seen += 1
      if (seen === count) return index + 1
    }
  }
  return formatted.length
}

/**
 * 입력값을 포맷하면서 커서 위치를 유지합니다.
 *
 * 포맷터는 값을 통째로 다시 만들기 때문에 그대로 두면 커서가 맨 뒤로 이동합니다.
 * 커서 앞의 숫자 개수를 기준으로 새 위치를 역산해 복원합니다.
 */
export function useFormattedInput(
  format: (value: string) => string,
  onValueChange: (value: string) => void,
) {
  const ref = useRef<HTMLInputElement>(null)
  const cursorRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    if (cursorRef.current === null || !ref.current) return

    ref.current.setSelectionRange(cursorRef.current, cursorRef.current)
    cursorRef.current = null
  })

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, selectionStart } = event.target
    const cursor = selectionStart ?? value.length
    const digitsBeforeCursor = countDigits(value.slice(0, cursor))

    const formatted = format(value)
    cursorRef.current = positionAfterDigits(formatted, digitsBeforeCursor)

    onValueChange(formatted)
  }

  return { ref, onChange }
}
