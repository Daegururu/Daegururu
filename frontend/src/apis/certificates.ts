import { client } from '@/apis/client'
import type { CertificateInfo } from '@/types/certificate'

/**
 * 사업자등록증 PDF를 올려 인식된 정보를 받아옵니다.
 *
 * Content-Type은 axios가 FormData를 보고 boundary까지 넣어 채우므로 직접 지정하지 않습니다.
 */
export async function uploadCertificate(file: File): Promise<CertificateInfo> {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await client.post<CertificateInfo>('/certificates/upload', formData)
  return data
}
