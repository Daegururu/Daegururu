import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { LogoMark, NavItem } from '@/components/common'
import { PATHS, isImplemented } from '@/routes/paths'

/**
 * 사이드바 메뉴입니다. 화면이 아직 없는 경로는 isImplemented가 false라
 * 자동으로 비활성 표시됩니다. 화면을 붙이면 routes/paths.ts의
 * IMPLEMENTED_PATHS에 추가하기만 하면 됩니다.
 */
const MENUS = [
  { label: '홈', path: PATHS.home },
  { label: '우리 가게 진단', path: PATHS.diagnosis },
  { label: 'AI 도우미', path: PATHS.assistant },
  { label: '매출·정산', path: PATHS.sales },
  { label: '금융 지원', path: PATHS.finance },
  { label: '마이페이지', path: PATHS.mypage },
] as const

export interface AppLayoutProps {
  /** 상단바 왼쪽에 표시할 화면 이름 */
  title: string
  /** 상단바 오른쪽 사용자 표기. 예: "김영수 사장님 · 대구 중구 동성로" */
  user: string
  children: ReactNode
}

/** 좌측 고정 사이드바 + 상단바를 가진 로그인 이후 공통 레이아웃입니다. */
export function AppLayout({ title, user, children }: AppLayoutProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    // 화면 전체는 스크롤하지 않고 콘텐츠 영역만 스크롤합니다. 사이드바·상단바가
    // 스크롤에 따라 다시 배치되지 않아 빠르게 스크롤해도 흔들리지 않습니다.
    <div className="flex h-screen overflow-hidden bg-bg-canvas">
      <aside className="flex w-60 shrink-0 flex-col gap-2 overflow-y-auto border-r border-border-default bg-bg-surface px-3 py-5">
        <div className="flex items-center gap-2.5 px-3 pb-5">
          <LogoMark size={32} />
          <span className="text-heading-m font-bold text-text-primary">대구르르</span>
        </div>

        <nav className="flex flex-col gap-1">
          {MENUS.map(({ label, path }) => {
            const ready = isImplemented(path)

            return (
              <NavItem
                key={label}
                active={pathname === path}
                disabled={!ready}
                onClick={ready ? () => navigate(path) : undefined}
              >
                {label}
              </NavItem>
            )
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border-default bg-bg-surface px-8">
          <h1 className="text-heading-m font-bold text-text-primary">{title}</h1>
          <div className="flex items-center gap-3">
            <span className="text-body-m text-text-secondary">{user}</span>
            <span aria-hidden className="size-8 rounded-full bg-bg-subtle" />
          </div>
        </header>

        {/* 스크롤은 main이 맡고, 내용 배치는 안쪽 div가 맡습니다. main에서 바로 flex로
            묶으면 내용이 길어질 때 카드들이 넘치지 않고 눌려서 잘립니다. */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
