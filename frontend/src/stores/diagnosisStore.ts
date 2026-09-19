import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DiagnosisState {
  /** 마지막으로 조회에 성공했을 때의 진단 이력 여부. 한 번도 확인하지 못했으면 null입니다. */
  lastKnownHasReport: boolean | null
  /** 대시보드 조회에 성공할 때마다 값을 갱신합니다. */
  remember: (hasReport: boolean) => void
  /** 로그인·로그아웃처럼 사용자가 바뀔 때 비웁니다. 이전 사용자의 진단 여부를 쓰면 안 됩니다. */
  forget: () => void
}

/** localStorage 키. 새로고침해도 마지막으로 확인된 값이 남습니다. */
const STORAGE_KEY = 'daegururu-diagnosis'

/*
 * 대시보드 조회가 실패하면 진단을 했는지 알 수 없습니다. 그때 AI 도우미를 막을지 정하려면
 * 마지막으로 확인된 값이 필요한데, react-query 캐시는 새로고침하면 사라져서 여기에 따로 둡니다.
 */
export const useDiagnosisStore = create<DiagnosisState>()(
  persist(
    (set) => ({
      lastKnownHasReport: null,
      remember: (hasReport) => set({ lastKnownHasReport: hasReport }),
      forget: () => set({ lastKnownHasReport: null }),
    }),
    { name: STORAGE_KEY },
  ),
)
