import { Outlet, useLocation } from 'react-router'

import { LogoMark } from '@/components/common'
import { cn } from '@/utils/cn'

/**
 * 스플래시(`/`)와 로그인(`/login`)이 함께 쓰는 셸입니다.
 * 두 화면이 같은 aside를 공유하기 때문에, 라우트가 바뀌면 패널이 사라졌다
 * 다시 그려지는 대신 전체 폭에서 왼쪽 패널 폭으로 줄어듭니다.
 */
export function AuthLayout() {
  const isSplash = useLocation().pathname === '/'

  return (
    <div className="flex min-h-screen flex-1 items-stretch overflow-hidden bg-bg-surface">
      <aside
        className={cn(
          'relative shrink-0 flex-col justify-center overflow-hidden bg-brand-primary transition-[width] duration-700 ease-in-out',
          // 스플래시에서는 화면을 꽉 채우고, 로그인에서는 왼쪽 패널로 줄어듭니다.
          // 좁은 화면의 로그인에는 패널이 없으므로 그때만 숨깁니다.
          isSplash ? 'flex w-full' : 'hidden w-full lg:flex lg:w-[560px]',
        )}
      >
        {/* 장식용 원. 브랜드 패널 밖으로 넘치는 부분은 잘립니다. */}
        <span
          aria-hidden
          className="absolute -top-[120px] left-[380px] size-[360px] rounded-full bg-white/6"
        />
        <span
          aria-hidden
          className="absolute -left-[80px] top-[760px] size-[220px] rounded-full bg-white/6"
        />

        {/* 패널이 줄어드는 동안 문구가 같이 밀려나지 않도록,
            폭은 고정하고 위치만 옮깁니다. */}
        <div
          className={cn(
            'relative flex w-full flex-col p-16 transition-transform duration-700 ease-in-out lg:w-[560px]',
            // 560px 패널의 절반만큼 오른쪽으로 밀어 화면 가운데에 둡니다.
            isSplash ? 'lg:translate-x-[calc(50vw-280px)]' : 'lg:translate-x-0',
          )}
        >
          {/* 스플래시부터 계속 보이는 부분.
              translate의 %는 이 블록 자신의 너비 기준이라, 폭을 몰라도
              `216px - 50%`로 화면 가운데에 맞출 수 있습니다.
              (216px = 패널 폭 560의 절반 280 - 좌측 패딩 64) */}
          <div
            className={cn(
              'flex w-fit flex-col gap-5 transition-transform duration-700 ease-in-out',
              isSplash ? 'mx-auto lg:mx-0 lg:translate-x-[calc(216px-50%)]' : 'lg:translate-x-0',
            )}
          >
            {/* 로고는 워드마크 폭을 기준으로 자리를 잡습니다. left를 50% → 38px로
                바꾸면(38 = 로고 76의 절반) 가운데 정렬에서 왼쪽 정렬로 이어집니다. */}
            <div className="relative h-[76px] w-full">
              <LogoMark
                size={76}
                className={cn(
                  'absolute top-0 -translate-x-1/2 transition-[left] duration-700 ease-in-out',
                  isSplash ? 'left-1/2' : 'left-[38px]',
                )}
              />
            </div>
            <p className="text-display-xl font-bold tracking-[-0.54px] text-text-inverse">
              대구르르
            </p>
          </div>

          {/* 로그인으로 넘어갈 때 펼쳐지는 소개 문구.
              grid-rows를 0fr → 1fr로 바꿔 높이까지 부드럽게 늘립니다. */}
          <div
            className={cn(
              'grid transition-[grid-template-rows,opacity] duration-700 ease-in-out',
              isSplash ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
            )}
            aria-hidden={isSplash}
          >
            <div className="flex flex-col gap-5 overflow-hidden pt-5">
              <p className="text-heading-m font-bold text-text-inverse">
                골목상권 데이터 기반 AI 컨설팅
              </p>
              <p className="text-body-l text-text-inverse/85">
                폐업 위험을 미리 진단하고,
                <br />
                필요한 자금을 제때 연결합니다.
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <Outlet />
      </main>
    </div>
  )
}
