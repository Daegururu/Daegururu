import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { deleteAccount, getMypage, patchPassword, patchStore } from '@/apis/mypage'

import { toMypage } from '../mapping'
import type { StoreProfile } from '../types'

const MYPAGE_KEY = ['mypage'] as const

/** 마이페이지 조회. 가게 정보·사업자 인증·계정 카드가 한 번에 옵니다. */
export function useMypage() {
  return useQuery({
    queryKey: MYPAGE_KEY,
    queryFn: getMypage,
    select: toMypage,
  })
}

/** 가게 정보 수정. 성공하면 마이페이지를 다시 불러 화면을 맞춥니다. */
export function useUpdateStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (profile: StoreProfile) =>
      patchStore({
        business_name: profile.name.trim(),
        industry_name: profile.category.trim(),
        business_type: profile.businessType.trim(),
        business_category: profile.businessCategory.trim(),
        business_address: profile.address.trim(),
        open_date: profile.openedAt,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MYPAGE_KEY }),
  })
}

/** 비밀번호 변경. 현재 비밀번호 대조는 서버가 하고, 틀리면 400 메시지가 옵니다. */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({ current, next }: { current: string; next: string }) =>
      patchPassword({ current_password: current, new_password: next }),
  })
}

/** 회원 탈퇴. 성공하면 서버가 쿠키를 지우므로 호출하는 쪽에서 프론트 상태만 비우면 됩니다. */
export function useDeleteAccount() {
  return useMutation({
    mutationFn: (password: string) => deleteAccount({ password }),
  })
}
