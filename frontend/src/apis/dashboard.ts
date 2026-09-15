import { client } from '@/apis/client'
import type { DashboardSummary } from '@/types/dashboard'
import type { Envelope } from '@/types/envelope'

/** 홈 대시보드 전체 데이터. 진단 이력이 없으면 hasReport가 false로 옵니다(DASH2001). */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await client.get<Envelope<DashboardSummary>>('/dashboard/summary')
  return data.result
}
