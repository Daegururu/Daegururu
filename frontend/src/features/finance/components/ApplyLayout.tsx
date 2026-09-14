import type { ReactNode } from 'react'

import { StepItem } from '@/components/common'
import { LogoBar } from '@/components/layout'
import { APPLY_STEPS } from '@/features/finance/mockData'
import { cn } from '@/utils/cn'

export interface ApplyLayoutProps {
  /** 로고 바 오른쪽에 표시할 상품명. 예: "iM뱅크 소상공인 특별운영자금 신청" */
  productName: string
  /** 현재 단계. 1부터 시작합니다. */
  currentStep: 1 | 2 | 3 | 4
  /** 스테퍼를 숨기고 카드만 가운데 둡니다. 완료 화면(09b)에서 씁니다. */
  hideSteps?: boolean
  children: ReactNode
}

/** 09·09b 신청 플로우 레이아웃. 로고 바 + 4단계 스테퍼 + 가운데 카드입니다. */
export function ApplyLayout({
  productName,
  currentStep,
  hideSteps = false,
  children,
}: ApplyLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-canvas">
      <LogoBar trailing={`${productName} 신청`} />

      <main className="flex flex-1 flex-col items-center gap-6 px-6 py-14">
        {!hideSteps && (
          <div className="flex w-full max-w-[840px] items-center gap-4">
            {APPLY_STEPS.map((label, index) => {
              const step = index + 1

              return (
                <div key={label} className="contents">
                  {index > 0 && <span aria-hidden className="h-0.5 flex-1 bg-border-default" />}
                  <StepItem
                    step={step}
                    state={step < currentStep ? 'done' : step === currentStep ? 'current' : 'todo'}
                  >
                    {label}
                  </StepItem>
                </div>
              )
            })}
          </div>
        )}

        <div
          className={cn(
            'flex w-full flex-col rounded-lg border border-border-default bg-bg-surface shadow-sm',
            hideSteps ? 'max-w-[640px] items-center gap-5 p-14' : 'max-w-[840px] gap-6 px-10 py-8',
          )}
        >
          {children}
        </div>
      </main>
    </div>
  )
}
