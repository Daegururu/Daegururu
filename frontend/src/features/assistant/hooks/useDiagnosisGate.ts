import { useEffect } from 'react'

import { useDashboardSummary } from '@/features/home/hooks/useDashboardSummary'
import { useDiagnosisStore } from '@/stores/diagnosisStore'

export interface DiagnosisGate {
  /** 진단 이력이 있는지. 확인하지 못했으면 null입니다. */
  hasReport: boolean | null
  /** 첫 조회가 끝나기 전이면 true입니다. */
  isChecking: boolean
}

/**
 * AI 도우미를 쓸 수 있는지 판단할 재료를 줍니다.
 *
 * 조회에 성공하면 그 값을 기억해 두고, 실패하면 기억해 둔 값을 대신 씁니다.
 * 그래서 서버가 잠시 죽어도 진단을 마친 사용자는 그대로 쓸 수 있고,
 * 진단 전인 사용자는 계속 막힙니다. 한 번도 확인하지 못했으면 막지 않습니다.
 */
export function useDiagnosisGate(): DiagnosisGate {
  const { data, isPending, isError } = useDashboardSummary()
  const lastKnownHasReport = useDiagnosisStore((state) => state.lastKnownHasReport)
  const remember = useDiagnosisStore((state) => state.remember)

  const fetched = data?.hasReport

  useEffect(() => {
    if (fetched !== undefined) remember(fetched)
  }, [fetched, remember])

  // 조회 중에는 아직 모르는 상태로 둡니다. 실패했을 때만 기억해 둔 값으로 답합니다.
  const hasReport = fetched ?? (isError ? lastKnownHasReport : null)

  return { hasReport, isChecking: isPending }
}
