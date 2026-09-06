/**
 * YYYY-MM-DD 문자열을 로컬 시간대 자정으로 만듭니다.
 *
 * new Date('2023-06-14')는 UTC 자정으로 해석되어 시간대에 따라 날짜가 하루 밀립니다.
 * 개업일은 시각이 아니라 달력상의 날짜이므로 연·월·일을 직접 넘깁니다.
 */
function parseCalendarDate(value: string): Date | null {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!matched) return null

  const [, year, month, day] = matched.map(Number)
  const date = new Date(year, month - 1, day)

  // 2023-02-30처럼 존재하지 않는 날짜는 다른 달로 넘어가므로 걸러냅니다.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }
  return date
}

/**
 * 개업일부터 오늘까지의 기간을 "N년 M개월" 형태로 만듭니다.
 * 1년 미만이면 "M개월", 1개월 미만이면 "1개월 미만"으로 표시합니다.
 */
export function formatBusinessPeriod(openedAt: string, now: Date = new Date()): string {
  const opened = parseCalendarDate(openedAt)
  if (!opened) return ''

  let months =
    (now.getFullYear() - opened.getFullYear()) * 12 + (now.getMonth() - opened.getMonth())
  // 개업일이 아직 지나지 않은 달은 빼줍니다.
  if (now.getDate() < opened.getDate()) months -= 1

  if (months < 0) return ''
  if (months === 0) return '1개월 미만'

  const years = Math.floor(months / 12)
  const restMonths = months % 12

  if (years === 0) return `${restMonths}개월`
  if (restMonths === 0) return `${years}년`
  return `${years}년 ${restMonths}개월`
}
