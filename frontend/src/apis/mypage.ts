import { client } from '@/apis/client'
import type {
  AccountDeleteRequest,
  MypageResponse,
  PasswordChangeRequest,
  StoreUpdateRequest,
  StoreUpdateResponse,
} from '@/types/mypage'

/** 마이페이지 조회. 가게 등록 전이면 404입니다. */
export async function getMypage(): Promise<MypageResponse> {
  const { data } = await client.get<MypageResponse>('/mypage')
  return data
}

/** 가게 정보 수정. 수정된 가게 정보가 함께 옵니다. */
export async function patchStore(body: StoreUpdateRequest): Promise<StoreUpdateResponse> {
  const { data } = await client.patch<StoreUpdateResponse>('/mypage/store', body)
  return data
}

/** 비밀번호 변경. 현재 비밀번호가 틀리면 400입니다. */
export async function patchPassword(body: PasswordChangeRequest): Promise<void> {
  await client.patch('/mypage/password', body)
}

/** 회원 탈퇴. 비밀번호가 틀리면 400이고, 성공하면 서버가 인증 쿠키도 지웁니다. */
export async function deleteAccount(body: AccountDeleteRequest): Promise<void> {
  // axios의 delete는 본문을 data 옵션으로 넘깁니다.
  await client.delete('/mypage/account', { data: body })
}
