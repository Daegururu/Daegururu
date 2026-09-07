import type { RiskLevel } from '@/utils/risk'
import { cn } from '@/utils/cn'

/** 미리보기용 등급 목록. 각 등급의 대표 점수도 함께 둡니다. */
export const PREVIEW_LEVELS = [
  { level: 'safe', label: '안전', score: 24 },
  { level: 'warn', label: '주의', score: 68 },
  { level: 'danger', label: '위험', score: 88 },
] as const satisfies readonly { level: RiskLevel; label: string; score: number }[]

export interface LevelPreviewToggleProps {
  value: RiskLevel
  onChange: (level: RiskLevel) => void
}

/**
 * 위험 등급별 화면을 확인하기 위한 미리보기 토글입니다.
 * 실제 등급은 진단 API가 내려주므로, 연동 시 이 토글은 걷어냅니다.
 */
export function LevelPreviewToggle({ value, onChange }: LevelPreviewToggleProps) {
  return (
    <div
      role="group"
      aria-label="위험 등급 미리보기"
      className="flex items-center gap-1 rounded-md border border-border-default bg-bg-subtle p-1"
    >
      {PREVIEW_LEVELS.map(({ level, label }) => (
        <button
          key={level}
          type="button"
          aria-pressed={value === level}
          onClick={() => onChange(level)}
          className={cn(
            'rounded-sm px-3 py-1 text-caption font-medium transition-colors',
            value === level
              ? 'bg-bg-surface text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
