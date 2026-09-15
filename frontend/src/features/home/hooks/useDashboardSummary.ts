import { useQuery } from '@tanstack/react-query'

import { getDashboardSummary } from '@/apis/dashboard'

export const DASHBOARD_SUMMARY_KEY = ['dashboard', 'summary'] as const

/** 홈 대시보드 조회. 로그인 상태에서만 호출됩니다(RequireAuth). */
export function useDashboardSummary() {
  return useQuery({
    queryKey: DASHBOARD_SUMMARY_KEY,
    queryFn: getDashboardSummary,
  })
}
