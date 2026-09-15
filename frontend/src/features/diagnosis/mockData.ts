import type { PrescriptionDetail } from './types'

/*
 * 04e 처방 실행 상세 목데이터입니다.
 * 리포트·탭 데이터는 진단 API로 교체됐고, 처방 상세는 아직 API가 없어 여기 남겨 둡니다.
 * 키는 API의 prescriptionId(rank 1 = 인건비 구조 점검)입니다. 상세 API가 생기면 이 파일을 지웁니다.
 */
export const MOCK_PRESCRIPTION_DETAILS: Record<string, PrescriptionDetail> = {
  '1': {
    id: '1',
    title: '인건비 구조 점검',
    description:
      '주휴수당 발생 구간을 피하도록 주간 근무 스케줄을 재배치하면 월 약 62만원 절감이 예상됩니다.',
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
          '현재 3명이 주 16~17시간으로 주휴수당 발생 구간에 걸쳐 있습니다. 4주 평균 기준이므로 특정 주만 줄여서는 효과가 없습니다. 근무표에서 해당 인원을 먼저 표시하세요.',
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
      '근로기준법상 주휴수당은 4주 평균 1주 소정근로시간이 15시간 이상이고 소정근로일에 개근한 경우 발생합니다.',
      '근무시간 단축은 근로자 동의가 필요하고, 일방적으로 줄이면 불이익 변경에 해당할 수 있습니다. 합의서 없이 진행하지 마세요.',
    ],
  },
}
