import type {
  CashFlowPoint,
  DiagnosisSummary,
  FixedCostItem,
  MetricSummary,
  SupportProgram,
} from './types'

/*
 * 홈 대시보드 목데이터입니다.
 * API 연동 시 백엔드와 합의한 대로 마지막 달(2026-08) 값만 실제 응답으로 교체하고
 * 나머지 달은 이 목데이터를 그대로 씁니다. 그래서 월별 값은 한 건씩 교체할 수 있게
 * 배열 한 줄에 한 달씩 두었습니다.
 */

export const MOCK_DIAGNOSIS: DiagnosisSummary = {
  score: 68,
  levelLabel: '주의 단계',
  updatedAt: '2026-08-29',
  title: '폐업 위험 주의 단계',
  descriptions: [
    '최근 매출 감소보다 고정비 비중 증가가 자금 부족에 더 큰 영향을 주고 있습니다.',
    '인건비가 전월 대비 18% 늘었고, 8월 주휴수당 정산분이 일시에 반영된 영향입니다.',
  ],
}

export const MOCK_METRICS: MetricSummary[] = [
  { label: '이번 달 매출', value: '18,420,000원', delta: '▲ 6.2% 전월 대비', tone: 'positive' },
  { label: '고정비 비중', value: '42.8%', delta: '▲ 5.1%p 전월 대비', tone: 'negative' },
  { label: '정산 예정', value: '3,180,000원', delta: '9월 4일 입금 예정', tone: 'neutral' },
  { label: '현금흐름', value: '-1,240,000원', delta: '▼ 2개월 연속 마이너스', tone: 'negative' },
]

/** 최근 12개월(2025-09 ~ 2026-08) 순현금흐름 */
export const MOCK_CASH_FLOW: CashFlowPoint[] = [
  { month: '9월', amount: 2150000 },
  { month: '10월', amount: 2480000 },
  { month: '11월', amount: 1960000 },
  { month: '12월', amount: 2820000 },
  { month: '1월', amount: 2540000 },
  { month: '2월', amount: 1680000 },
  { month: '3월', amount: 1120000 },
  { month: '4월', amount: 620000 },
  { month: '5월', amount: 1180000 },
  { month: '6월', amount: 240000 },
  { month: '7월', amount: -420000 },
  { month: '8월', amount: -1240000 },
]

/** 현금흐름 차트의 동일 상권·업종 평균 참고선 값(원) */
export const MOCK_CASH_FLOW_AVERAGE = 1150000

export const MOCK_CASH_FLOW_NOTE = '2개월 연속 순현금흐름 마이너스 — 운영자금 확보 필요'

export const MOCK_FIXED_COSTS: FixedCostItem[] = [
  { label: '인건비', ratio: 38, averageRatio: 32 },
  { label: '임대료', ratio: 34, averageRatio: 29 },
  { label: '기타 고정비', ratio: 28, averageRatio: 39 },
]

export const MOCK_FIXED_COST_NOTE = '인건비 비중이 가장 큽니다'

export const MOCK_SUPPORT_PROGRAMS: SupportProgram[] = [
  {
    id: 'daegu-alley',
    name: '대구시 골목상권 활력자금',
    status: '신청 가능',
    limit: '한도 2,000만원',
    rate: '금리 연 1.5%',
  },
  {
    id: 'im-bank',
    name: 'iM뱅크 소상공인 특별운영자금',
    status: '신청 가능',
    limit: '한도 5,000만원',
    rate: '금리 연 2.8%',
  },
  {
    id: 'semas',
    name: '소상공인시장진흥공단 정책자금',
    status: '신청 가능',
    limit: '한도 7,000만원',
    rate: '금리 연 3.2%',
  },
]

/** 상단바에 표시할 사용자 정보 */
export const MOCK_USER = '김영수 사장님 · 대구 중구 동성로'
