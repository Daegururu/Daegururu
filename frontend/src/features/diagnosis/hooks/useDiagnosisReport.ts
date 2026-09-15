import { useQuery } from '@tanstack/react-query'

import {
  getDiagnosisCashflow,
  getDiagnosisFixedCost,
  getDiagnosisReport,
  getDiagnosisSales,
  getDiagnosisSettlement,
} from '@/apis/diagnosis'
import type { ReportTab } from '@/features/diagnosis/types'

const REPORT_KEY = ['diagnosis', 'report'] as const

/** 리포트 본체. 헤더·점수·원인·처방을 채웁니다. */
export function useDiagnosisReport() {
  return useQuery({ queryKey: REPORT_KEY, queryFn: getDiagnosisReport })
}

/** 탭 4개는 엔드포인트가 나뉘어 있어 각각 따로 부릅니다. 안 보는 탭은 부르지 않습니다. */
export function useDiagnosisSales(enabled: boolean) {
  return useQuery({ queryKey: [...REPORT_KEY, 'sales'], queryFn: getDiagnosisSales, enabled })
}

export function useDiagnosisFixedCost(enabled: boolean) {
  return useQuery({
    queryKey: [...REPORT_KEY, 'fixedCost'],
    queryFn: getDiagnosisFixedCost,
    enabled,
  })
}

export function useDiagnosisCashflow(enabled: boolean) {
  return useQuery({
    queryKey: [...REPORT_KEY, 'cashFlow'],
    queryFn: getDiagnosisCashflow,
    enabled,
  })
}

export function useDiagnosisSettlement(enabled: boolean) {
  return useQuery({
    queryKey: [...REPORT_KEY, 'settlement'],
    queryFn: getDiagnosisSettlement,
    enabled,
  })
}

/** 탭 id를 그대로 넘기면 해당 탭 조회만 켜지도록 묶어 둡니다. */
export function useDiagnosisTabQueries(tab: ReportTab) {
  return {
    sales: useDiagnosisSales(tab === 'sales'),
    fixedCost: useDiagnosisFixedCost(tab === 'fixedCost'),
    cashFlow: useDiagnosisCashflow(tab === 'cashFlow'),
    settlement: useDiagnosisSettlement(tab === 'settlement'),
  }
}
