/**
 * 개업일부터 오늘까지의 기간을 "N년 M개월" 형태로 만듭니다.
 * 1년 미만이면 "M개월", 1개월 미만이면 "1개월 미만"으로 표시합니다.
 */
export function formatBusinessPeriod(openedAt: string, now: Date = new Date()): string {
  const opened = new Date(openedAt)
  if (Number.isNaN(opened.getTime())) return ''

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
