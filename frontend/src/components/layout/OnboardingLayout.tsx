import type { ReactNode } from 'react'

import { StepItem } from '@/components/common'
import { LogoBar } from '@/components/layout/LogoBar'
import { cn } from '@/utils/cn'

const STEPS = ['가게 정보', '진단 시작'] as const

export interface OnboardingLayoutProps {
  /** 현재 단계. 1부터 시작합니다. */
  currentStep: 1 | 2
  children: ReactNode
}

/** 로고 바 + 2단계 스텝퍼가 있는 온보딩 카드 레이아웃입니다. */
export function OnboardingLayout({ currentStep, children }: OnboardingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-canvas">
      <LogoBar />

      <main className="flex flex-1 justify-center px-6 py-16">
        <div
          className={cn(
            'flex h-fit w-full max-w-[720px] flex-col gap-8',
            'rounded-lg border border-border-default bg-bg-surface px-12 py-10 shadow-sm',
          )}
        >
          <div className="flex items-center gap-4">
            {STEPS.map((label, index) => {
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

          {children}
        </div>
      </main>
    </div>
  )
}
