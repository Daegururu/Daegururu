import { useState } from 'react'

import { Button, Toggle } from '@/components/common'
import { NOTIFICATION_CHANNELS, NOTIFICATION_TYPES } from '@/features/mypage/mockData'
import type { NotificationSetting, NotificationValues } from '@/features/mypage/types'

interface ToggleGroupProps {
  title: string
  items: NotificationSetting[]
  values: NotificationValues
  onToggle: (key: NotificationSetting['key'], checked: boolean) => void
}

function ToggleGroup({ title, items, values, onToggle }: ToggleGroupProps) {
  return (
    <section className="flex flex-col gap-2 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
      <h3 className="text-heading-s font-bold text-text-primary">{title}</h3>
      <ul className="flex flex-col">
        {items.map(({ key, label, description }) => (
          <li
            key={key}
            className="flex items-center justify-between gap-6 border-b border-bg-subtle py-3 last:border-b-0"
          >
            <div className="flex flex-col gap-0.5">
              <p className="text-body-m font-medium text-text-primary">{label}</p>
              <p className="text-caption text-text-tertiary">{description}</p>
            </div>
            <Toggle
              checked={values[key]}
              onChange={(checked) => onToggle(key, checked)}
              ariaLabel={label}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

export interface NotificationSettingsProps {
  values: NotificationValues
  onSave: (values: NotificationValues) => void
}

/** 10c 알림 설정 탭. 받을 알림 5개와 받는 방법 3개를 토글로 켜고 끕니다. */
export function NotificationSettings({ values, onSave }: NotificationSettingsProps) {
  const [draft, setDraft] = useState<NotificationValues>(values)

  const handleToggle = (key: NotificationSetting['key'], checked: boolean) => {
    setDraft((prev) => ({ ...prev, [key]: checked }))
  }

  return (
    <div className="flex flex-col gap-6">
      <ToggleGroup
        title="받을 알림"
        items={NOTIFICATION_TYPES}
        values={draft}
        onToggle={handleToggle}
      />
      <ToggleGroup
        title="받는 방법"
        items={NOTIFICATION_CHANNELS}
        values={draft}
        onToggle={handleToggle}
      />

      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" onClick={() => setDraft(values)}>
          취소
        </Button>
        <Button onClick={() => onSave(draft)}>저장</Button>
      </div>
    </div>
  )
}
