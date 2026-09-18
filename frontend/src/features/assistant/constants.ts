/** 대화 이력 API가 없어서 화면에 들어올 때 붙이는 첫 인사입니다. */
export function greetingParagraphs(representativeName: string): string[] {
  const owner = representativeName ? `${representativeName} 사장님` : '사장님'
  return [
    `안녕하세요, ${owner}. 우리 가게 매출·고정비·정산 데이터를 바탕으로 답변해 드립니다.`,
    '이번 달 고정비가 왜 늘었는지, 받을 수 있는 지원금이 있는지 궁금한 걸 물어보세요.',
  ]
}

/** 입력창 위 추천 질문 칩. 누르면 그 문구가 그대로 전송됩니다. 백엔드가 답할 수 있는 주제만 둡니다. */
export const SUGGESTED_QUESTIONS = [
  '이번 달 고정비가 왜 늘었어요?',
  '정산 언제 들어와요?',
  '지원금 받을 수 있어요?',
]
