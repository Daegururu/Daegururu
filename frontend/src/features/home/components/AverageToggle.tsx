import { useId } from 'react'

export interface AverageToggleProps {
  /** 라디오 왼쪽 설명. 예: "업종 평균 참고선" */
  label: string
  /** true면 업종 평균을 표시합니다. */
  value: boolean
  onChange: (next: boolean) => void
}

/** 업종 평균을 표시·해제하는 라디오 한 쌍입니다. 기본값은 해제입니다. */
export function AverageToggle({ label, value, onChange }: AverageToggleProps) {
  // 같은 화면에 라디오 그룹이 2개라 name이 겹치지 않도록 id를 만들어 씁니다.
  const name = useId()
  const labelId = useId()

  const options = [
    { text: '표시', checked: value },
    { text: '해제', checked: !value },
  ]

  return (
    <div className="flex items-center gap-6">
      <span id={labelId} className="text-caption text-text-secondary">
        {label}
      </span>
      {/* 읽어주는 순서상 그룹 이름이 먼저 오도록 설명 span을 aria-labelledby로 묶습니다. */}
      <div role="radiogroup" aria-labelledby={labelId} className="flex items-center gap-4">
        {options.map(({ text, checked }) => (
          <label key={text} className="flex cursor-pointer items-center gap-1.5">
            <input
              type="radio"
              name={name}
              checked={checked}
              onChange={() => onChange(text === '표시')}
              className="size-4 accent-brand-primary"
            />
            <span className="text-caption text-text-primary">{text}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
