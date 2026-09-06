/** 폐업 위험 등급. 0-40 safe / 41-75 warn / 76-100 danger */
export type RiskLevel = 'safe' | 'warn' | 'danger'

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 40) return 'safe'
  if (score <= 75) return 'warn'
  return 'danger'
}
