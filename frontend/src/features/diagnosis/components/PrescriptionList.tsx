import { Button } from '@/components/common'
import type { Prescription } from '@/features/diagnosis/types'

export interface PrescriptionListProps {
  prescriptions: Prescription[]
  /** 04e 처방 실행 화면으로 이동합니다. */
  onExecute?: (id: string) => void
}

/** 번호가 붙은 맞춤 처방 목록입니다. */
export function PrescriptionList({ prescriptions, onExecute }: PrescriptionListProps) {
  return (
    <section className="flex flex-col gap-2 rounded-lg border border-border-default bg-bg-surface p-6 shadow-sm">
      <h3 className="text-heading-s font-bold text-text-primary">맞춤 처방</h3>

      <ul className="flex flex-col">
        {prescriptions.map(({ id, title, description }, index) => (
          <li
            key={id}
            className="flex items-center gap-4 border-b border-border-default py-4 last:border-b-0"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-body-m font-medium text-text-brand">
              {index + 1}
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="text-body-m font-medium text-text-primary">{title}</p>
              <p className="text-body-s text-text-secondary">{description}</p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              disabled={!onExecute}
              onClick={onExecute ? () => onExecute(id) : undefined}
            >
              실행하기
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
