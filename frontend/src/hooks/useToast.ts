import { createContext, useContext } from 'react'

export interface ToastContextValue {
  /** 하단에 짧은 안내 문구를 띄웁니다. 같은 문구를 연달아 띄우면 시간만 다시 셉니다. */
  showToast: (message: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast는 ToastProvider 안에서만 사용할 수 있습니다')
  }
  return context
}
