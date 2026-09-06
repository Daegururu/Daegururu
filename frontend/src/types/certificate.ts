/**
 * POST /api/v1/certificates/upload 응답.
 *
 * 서버는 PDF에서 텍스트를 추출한 뒤(스캔본이면 OCR을 거쳐) 항목을 뽑아내므로
 * 인식하지 못한 항목은 null로 내려옵니다.
 */
export interface CertificateInfo {
  /** 기업명 */
  company_name: string | null
  /** 사업자등록번호 */
  business_number: string | null
  /** 대표자명 */
  representative_name: string | null
  /** 사업장 주소 */
  business_address: string | null
  /** 주업종 */
  main_business: string | null
  /** 유효기간 시작일 (YYYY-MM-DD) */
  valid_from: string | null
  /** 유효기간 종료일 (YYYY-MM-DD) */
  valid_until: string | null
  /** 확인서 용도 (예: 중소기업 확인서) */
  certificate_type: string | null
  /** 소상공인 여부 */
  is_small_business: boolean | null
}
