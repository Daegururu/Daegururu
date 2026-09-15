import { client } from '@/apis/client'
import type {
  DiagnosisFixedCost,
  DiagnosisMonthlySeries,
  DiagnosisReport,
  DiagnosisSettlement,
} from '@/types/diagnosis'
import type { Envelope } from '@/types/envelope'

/** 리포트 본체(점수·원인·처방). 진단 이력이 없으면 hasReport가 false로 옵니다. */
export async function getDiagnosisReport(): Promise<DiagnosisReport> {
  const { data } = await client.get<Envelope<DiagnosisReport>>('/diagnosis/report')
  return data.result
}

export async function getDiagnosisSales(): Promise<DiagnosisMonthlySeries> {
  const { data } = await client.get<Envelope<DiagnosisMonthlySeries>>('/diagnosis/report/sales')
  return data.result
}

export async function getDiagnosisFixedCost(): Promise<DiagnosisFixedCost> {
  const { data } = await client.get<Envelope<DiagnosisFixedCost>>('/diagnosis/report/fixed-cost')
  return data.result
}

export async function getDiagnosisCashflow(): Promise<DiagnosisMonthlySeries> {
  const { data } = await client.get<Envelope<DiagnosisMonthlySeries>>('/diagnosis/report/cashflow')
  return data.result
}

export async function getDiagnosisSettlement(): Promise<DiagnosisSettlement> {
  const { data } = await client.get<Envelope<DiagnosisSettlement>>('/diagnosis/report/settlement')
  return data.result
}
