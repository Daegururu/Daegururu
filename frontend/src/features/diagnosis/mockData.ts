import type {
  CashFlowRecent,
  CauseAnalysis,
  FixedCostRow,
  FixedCostShare,
  MonthlyAmount,
  Prescription,
  PrescriptionDetail,
  ReportSummary,
  SettlementRow,
} from './types'

/*
 * 진단 리포트 목데이터입니다.
 * 홈 화면과 마찬가지로 API 연동 시 마지막 달(2026-08) 값만 실제 응답으로 교체하고
 * 나머지 달은 이 목데이터를 그대로 씁니다. 월별 값은 한 줄에 한 달씩 두었습니다.
 */

export const MOCK_REPORT: ReportSummary = {
  title: '2026년 8월 진단 리포트',
  meta: '2026-08-29 생성 · 영수네 국밥 (한식 음식점업)',
  score: 68,
  level: 'warn',
  levelLabel: '주의',
}

/** 매출 탭. 최근 3개월은 색을 달리해 강조합니다. 단위는 만원입니다. */
export const MOCK_MONTHLY_SALES: MonthlyAmount[] = [
  { month: '9월', amount: 1780 },
  { month: '10월', amount: 1850 },
  { month: '11월', amount: 1690 },
  { month: '12월', amount: 2100 },
  { month: '1월', amount: 2020 },
  { month: '2월', amount: 1880 },
  { month: '3월', amount: 1760 },
  { month: '4월', amount: 1700 },
  { month: '5월', amount: 1820 },
  { month: '6월', amount: 1660, highlighted: true },
  { month: '7월', amount: 1734, highlighted: true },
  { month: '8월', amount: 1842, highlighted: true },
]

export const MOCK_SALES_NOTE =
  '8월 매출은 전월 대비 6.2% 늘었지만, 고정비 증가폭이 더 커 현금흐름은 악화되었습니다.'

/** 고정비 탭 */
export const MOCK_FIXED_COST_META = '2026년 8월 · 총 7,880,000원'

export const MOCK_FIXED_COST_SHARES: FixedCostShare[] = [
  { label: '인건비', ratio: 55.8 },
  { label: '임대료', ratio: 22.8 },
  { label: '기타 고정비', ratio: 21.4 },
]

export const MOCK_FIXED_COST_ROWS: FixedCostRow[] = [
  { label: '인건비', amount: 4400000, ratio: 55.8, delta: 18 },
  { label: '임대료', amount: 1800000, ratio: 22.8, delta: 0 },
  { label: '배달 수수료', amount: 810000, ratio: 10.3, delta: 5.4 },
  { label: '공과금', amount: 620000, ratio: 7.9, delta: 3.1 },
  { label: '기타', amount: 250000, ratio: 3.2, delta: -1.2 },
]

export const MOCK_FIXED_COST_NOTE =
  '인건비가 고정비의 55.8%를 차지합니다. 전월 대비 +18.0%이고, 증가분 118만원은 8월 주휴수당 정산분이 일시에 반영된 것입니다.'

/** 현금흐름 탭. 단위는 만원입니다. */
export const MOCK_MONTHLY_CASH_FLOW: MonthlyAmount[] = [
  { month: '9월', amount: 215 },
  { month: '10월', amount: 248 },
  { month: '11월', amount: 196 },
  { month: '12월', amount: 282 },
  { month: '1월', amount: 254 },
  { month: '2월', amount: 168 },
  { month: '3월', amount: 112 },
  { month: '4월', amount: 62 },
  { month: '5월', amount: 118 },
  { month: '6월', amount: 82 },
  { month: '7월', amount: -41 },
  { month: '8월', amount: -124 },
]

export const MOCK_RECENT_CASH_FLOW: CashFlowRecent[] = [
  { month: '8월', amount: -1240000 },
  { month: '7월', amount: -410000 },
  { month: '6월', amount: 820000 },
]

export const MOCK_RECENT_CASH_FLOW_NOTE = '2개월 연속 마이너스 · 3개월 누적 -830,000원'

export const MOCK_CASH_FLOW_NOTE =
  '7월부터 순현금흐름이 2개월 연속 마이너스입니다. 8월은 매출이 6.2% 늘었는데도 -1,240,000원으로, 고정비 증가와 카드 정산 지연이 겹친 결과입니다.'

/** 정산 탭 */
export const MOCK_SETTLEMENT_META = '2026년 8월 · 정산 예정 3,180,000원'

export const MOCK_SETTLEMENTS: SettlementRow[] = [
  {
    date: '2026-09-04',
    kind: '카드',
    content: '신한카드 8/25~8/31 매출 정산',
    amount: 1840000,
    status: '정산 예정',
  },
  {
    date: '2026-09-06',
    kind: '카드',
    content: 'BC카드 8/25~8/31 매출 정산 (D+5)',
    amount: 1340000,
    status: '정산 예정',
  },
  {
    date: '2026-08-29',
    kind: '배달',
    content: '배달의민족 8월 2주차 정산',
    amount: 620000,
    status: '정산 완료',
  },
]

export const MOCK_SETTLEMENT_NOTE =
  'BC카드 정산 주기가 D+5로 가장 길어, 9월 6일까지 1,340,000원이 묶여 있습니다. 이 지연이 8월 순현금흐름 마이너스의 원인 중 하나입니다.'

/** 탭과 무관하게 하단에 공통으로 붙는 원인 분석입니다. */
export const MOCK_CAUSE: CauseAnalysis = {
  descriptions: [
    '최근 매출 감소보다 고정비 비중 증가가 자금 부족에 더 큰 영향을 주고 있습니다.',
    '인건비가 전월 대비 18% 늘었고, 이는 8월 주휴수당 정산분이 일시에 반영된 영향입니다.',
  ],
  evidences: [
    '고정비 비중 42.8% — 동일 업종 평균 34.1% 대비 8.7%p 높음',
    '인건비 7,880,000원 — 전월 대비 +18.0% (주휴수당 일시 반영)',
    '순현금흐름 2개월 연속 마이너스 — 8월 -1,240,000원',
  ],
}

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'labor-cost',
    title: '인건비 구조 점검',
    description:
      '주휴수당 발생 구간을 피하도록 주간 근무 스케줄을 재배치하면 월 약 62만원 절감이 예상됩니다.',
  },
  {
    id: 'policy-fund',
    title: '소상공인 정책자금 신청',
    description:
      '현재 조건으로 iM뱅크 특별운영자금 5,000만원 한도, 연 2.8% 금리 신청이 가능합니다.',
  },
  {
    id: 'delivery-fee',
    title: '배달 수수료 재협상',
    description:
      '배달 매출 비중 31%, 평균 수수료율 14.2%. 정액제 전환 시 월 약 38만원 절감이 가능합니다.',
  },
]

/**
 * 04e 처방 실행 상세입니다. 처방 유형마다 내용이 달라, 지금은 Figma에 있는
 * 인건비 구조 점검 1건만 채워 둡니다.
 */
export const MOCK_PRESCRIPTION_DETAILS: Record<string, PrescriptionDetail> = {
  'labor-cost': {
    ...MOCK_PRESCRIPTIONS[0],
    meta: '진단 리포트가 제안한 처방입니다 · 예상 절감 월 620,000원 · 9월 급여부터 반영 가능',
    currentState: [
      { label: '8월 인건비', value: '4,400,000원', caption: '전월 대비 +18.0%', tone: 'danger' },
      { label: '주휴수당 발생 인원', value: '3명', caption: '주 16~17시간 근무', tone: 'neutral' },
      { label: '예상 절감액', value: '620,000원', caption: '월 기준', tone: 'brand' },
    ],
    steps: [
      {
        title: '주간 근무표에서 주 15시간 경계 확인',
        description:
          '현재 3명이 주 16~17시간으로 주휴수당 발생 구간에 걸쳐 있습니다. 근무표에서 해당 인원을 먼저 표시하세요.',
      },
      {
        title: '2명의 근무를 주 14시간으로 재배치',
        description:
          '줄인 시간은 평일 점심·저녁 피크타임에 몰아 배치하면 매출 손실 없이 조정할 수 있습니다.',
      },
      {
        title: '근로계약서 변경분 반영 후 9월 급여에 적용',
        description:
          '근무시간 단축은 근로자 동의가 필요합니다. 합의서를 받고 9월 1일자로 적용하면 9월 급여부터 반영됩니다.',
      },
    ],
    effects: [
      { label: '월 인건비', before: '4,400,000원', after: '3,780,000원', diff: '-620,000원' },
      { label: '고정비 비중', before: '42.8%', after: '39.4%', diff: '-3.4%p' },
      { label: '종합 위험 점수', before: '68', after: '61', diff: '-7' },
    ],
    summary: [
      { label: '예상 절감', value: '월 620,000원' },
      { label: '반영 시점', value: '9월 급여' },
      { label: '필요한 것', value: '근로자 합의서' },
      { label: '난이도', value: '보통' },
    ],
    notices: [
      '근로기준법상 주휴수당은 주 15시간 이상 근무할 때 발생합니다.',
      '근무시간 단축은 근로자 동의가 필요하고, 일방적으로 줄이면 불이익 변경에 해당할 수 있습니다. 합의서 없이 진행하지 마세요.',
    ],
  },
}

/** 상단바에 표시할 사용자 정보 */
export const MOCK_USER = '김영수 사장님 · 대구 중구 동성로'
