import type { ReactNode } from 'react'

import { Modal, type ModalProps } from '@/components/common/Modal'

export interface FormModalProps extends Pick<ModalProps, 'open' | 'onClose' | 'size'> {
  title: string
  /** 제목 아래 한 줄 설명 */
  description?: string
  children: ReactNode
  /** 오른쪽 아래 버튼 묶음. 보통 [취소] + 주 동작입니다. */
  footer: ReactNode
}

/**
 * 제목·닫기·설명·본문·버튼 순으로 구성된 폼 모달 템플릿입니다.
 * 거래 추가, 내보내기, 비밀번호 변경처럼 입력을 받는 모달이 공통으로 씁니다.
 */
export function FormModal({
  open,
  onClose,
  size = 'lg',
  title,
  description,
  children,
  footer,
}: FormModalProps) {
  return (
    <Modal open={open} onClose={onClose} size={size} padded={false} ariaLabel={title}>
      <div className="flex min-h-0 flex-col gap-8 overflow-y-auto p-9">
        <header className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-heading-m font-bold text-text-primary">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="rounded-sm text-[18px] leading-6 text-text-tertiary transition-colors hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-border-brand"
            >
              ✕
            </button>
          </div>
          {description && <p className="text-body-s text-text-secondary">{description}</p>}
        </header>

        {children}

        <footer className="flex items-center justify-end gap-3">{footer}</footer>
      </div>
    </Modal>
  )
}
