import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { TERMS_DOCUMENTS, type TermsKey } from '@/constants/terms'

export interface TermsModalProps {
  /** 열려 있는 약관. null이면 모달이 닫힙니다. */
  termsKey: TermsKey | null
  /** [확인]을 눌러 약관에 동의한 경우 */
  onConfirm: (termsKey: TermsKey) => void
  /** [✕]·ESC·배경 클릭으로 닫은 경우. 동의 상태를 바꾸지 않습니다. */
  onClose: () => void
}

/**
 * 약관 상세보기 모달. 세 약관이 같은 템플릿을 쓰고 내용만 교체됩니다.
 * [확인]은 동의로 처리하고, [✕]로 닫으면 기존 동의 상태를 유지합니다.
 */
export function TermsModal({ termsKey, onConfirm, onClose }: TermsModalProps) {
  const document = termsKey ? TERMS_DOCUMENTS[termsKey] : null

  return (
    <Modal
      open={document !== null}
      onClose={onClose}
      size="lg"
      padded={false}
      ariaLabel={document?.title}
    >
      {document && (
        <>
          <header className="flex shrink-0 items-center justify-between border-b border-border-default px-8 pt-6 pb-5">
            <h2 className="text-[18px] leading-normal font-bold text-text-primary">
              {document.title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="text-[18px] leading-normal text-text-tertiary hover:text-text-primary"
            >
              ✕
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-8 py-6">
            {document.sections.map((section) => (
              <section key={section.title} className="flex flex-col gap-4">
                <h3 className="text-[15px] leading-normal font-medium text-text-primary">
                  {section.title}
                </h3>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-body-s leading-[1.6] text-text-secondary">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <footer className="flex shrink-0 justify-end border-t border-border-default px-8 pt-5 pb-6">
            <Button onClick={() => termsKey && onConfirm(termsKey)}>확인</Button>
          </footer>
        </>
      )}
    </Modal>
  )
}
