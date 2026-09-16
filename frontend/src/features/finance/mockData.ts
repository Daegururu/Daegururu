import type { ApplicationReceipt } from './types'

/*
 * 09b 신청 완료 접수 정보 목데이터입니다.
 * 상품 목록·상세는 금융 API로 교체됐고, 신청 제출 API는 후순위라 접수 정보만 여기 남겨 둡니다.
 * 접수일은 화면에서 오늘 날짜로 채웁니다. 신청 API가 생기면 제출 응답으로 바꾸고 이 파일을 지웁니다.
 */
export const MOCK_APPLICATION_RECEIPT: Omit<ApplicationReceipt, 'receivedAt'> = {
  amount: '30,000,000원',
  receiptNumber: 'DG-2026-0916-0001',
}
