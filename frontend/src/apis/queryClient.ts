import { QueryClient } from '@tanstack/react-query'

/** 같은 화면을 오가며 같은 데이터를 다시 부르지 않을 정도의 시간입니다. */
const STALE_TIME_MS = 60_000

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      // 업로드처럼 값을 바꾸는 요청은 사용자가 직접 다시 누르게 합니다.
      retry: 0,
    },
  },
})
