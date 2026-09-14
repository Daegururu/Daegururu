import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { ToastContext } from '@/hooks/useToast'

/** 토스트가 떠 있는 시간 */
const DURATION_MS = 3000

/** 화면 하단 중앙에 문구 하나를 띄웁니다. 앱 루트에서 한 번만 감쌉니다. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((next: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setMessage(next)
    timerRef.current = setTimeout(() => setMessage(null), DURATION_MS)
  }, [])

  // 언마운트 시 남은 타이머를 정리합니다.
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message && <Toast message={message} />}
    </ToastContext.Provider>
  )
}

function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-8 z-[60] flex justify-center px-6"
    >
      <p className="animate-toast-in rounded-md bg-bg-inverse px-5 py-3 text-body-m font-medium text-text-inverse shadow-md">
        {message}
      </p>
    </div>
  )
}
