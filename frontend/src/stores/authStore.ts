import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { queryClient } from '@/apis/queryClient'
import { useDiagnosisStore } from '@/stores/diagnosisStore'
import type { AuthResponse } from '@/types/auth'

/** 로그인한 사용자. 화면에서 바로 쓰기 좋게 camelCase로 옮겨 둡니다. */
export interface AuthUser {
  userId: number
  /** 하이픈을 뺀 사업자등록번호 */
  businessRegNo: string
  representativeName: string
}

interface AuthState {
  /**
   * 로그인한 사용자. 토큰은 HttpOnly 쿠키라 프론트가 읽을 수 없어서, 이 값이 있으면 로그인 상태로 봅니다.
   * 쿠키가 먼저 만료되면 다음 요청의 401에서 지워집니다.
   */
  user: AuthUser | null
  /** 회원가입·로그인 응답을 그대로 넘기면 유저 정보를 저장합니다. */
  setAuth: (response: AuthResponse) => void
  /**
   * 로그아웃·401 응답에서 호출합니다. 유저가 사라지면 RequireAuth가 로그인으로 보냅니다.
   * 다음 사용자가 이전 사용자의 응답을 보지 않도록 react-query 캐시도 함께 비웁니다.
   */
  clearAuth: () => void
}

/** localStorage 키. 새로고침해도 로그인 상태가 유지됩니다. */
const STORAGE_KEY = 'daegururu-auth'

/*
 * 로그인 유저는 서버 데이터가 아니라 앱 전역 상태라 react-query 대신 여기 둡니다.
 * 컴포넌트 밖(axios 인터셉터)에서는 useAuthStore.getState()로 읽습니다.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setAuth: ({ user_id, business_reg_no, representative_name }) => {
        set({
          user: {
            userId: user_id,
            businessRegNo: business_reg_no,
            representativeName: representative_name,
          },
        })
        // 로그인 상태에서 다른 계정으로 가입하면 이전 계정의 조회 캐시가 남습니다. 함께 비웁니다.
        queryClient.clear()
        useDiagnosisStore.getState().forget()
      },
      clearAuth: () => {
        set({ user: null })
        queryClient.clear()
        useDiagnosisStore.getState().forget()
      },
    }),
    {
      name: STORAGE_KEY,
      // 토큰을 localStorage에 두던 시절 값은 버립니다. 버전이 다르면 저장된 상태를 무시하고 처음부터 시작합니다.
      version: 1,
    },
  ),
)
