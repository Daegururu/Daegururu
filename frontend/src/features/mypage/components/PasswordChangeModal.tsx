import { useState } from 'react'

import { Button, FormModal, PasswordInput } from '@/components/common'
import { validatePassword } from '@/utils/validate'

type FieldKey = 'current' | 'next' | 'confirm'

const EMPTY: Record<FieldKey, string> = { current: '', next: '', confirm: '' }

export interface PasswordChangeModalProps {
  open: boolean
  onClose: () => void
  /**
   * 화면 검증을 통과하면 호출합니다. 현재 비밀번호 대조는 서버가 하므로,
   * 거절되면 그 문구를 현재 비밀번호 칸 아래에 보여줍니다. 성공하면 모달을 비웁니다.
   */
  onSave: (current: string, next: string) => Promise<void>
  /** 변경 요청 중이면 true. 버튼을 잠급니다. */
  saving?: boolean
}

/** 10d 비밀번호 변경 모달. 10 계정 카드의 [변경]으로 엽니다. */
export function PasswordChangeModal({
  open,
  onClose,
  onSave,
  saving = false,
}: PasswordChangeModalProps) {
  const [form, setForm] = useState<Record<FieldKey, string>>(EMPTY)
  const [errors, setErrors] = useState<Record<FieldKey, string>>(EMPTY)

  const update = (field: FieldKey) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const reset = () => {
    setForm(EMPTY)
    setErrors(EMPTY)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSave = async () => {
    const nextErrors: Record<FieldKey, string> = {
      current: form.current ? '' : '현재 비밀번호를 입력해주세요',
      next:
        validatePassword(form.next) ||
        (form.next === form.current ? '현재 비밀번호와 다른 비밀번호를 입력해주세요' : ''),
      confirm: form.confirm === form.next ? '' : '새 비밀번호가 일치하지 않습니다',
    }
    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) return

    try {
      await onSave(form.current, form.next)
      reset()
    } catch (error) {
      // 서버가 거절하는 경우는 현재 비밀번호 불일치뿐이라 그 칸에 붙입니다.
      setErrors((prev) => ({
        ...prev,
        current: error instanceof Error ? error.message : '비밀번호를 변경하지 못했습니다',
      }))
    }
  }

  return (
    <FormModal
      open={open}
      onClose={handleClose}
      title="비밀번호 변경"
      description="안전한 비밀번호로 변경하세요. 8자 이상, 영문·숫자·특수문자 조합을 권장합니다."
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={saving}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? '변경 중...' : '저장'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <PasswordInput
          label="현재 비밀번호"
          value={form.current}
          onChange={(event) => update('current')(event.target.value)}
          errorMessage={errors.current}
          autoComplete="current-password"
        />
        <PasswordInput
          label="새 비밀번호"
          value={form.next}
          onChange={(event) => update('next')(event.target.value)}
          errorMessage={errors.next}
          autoComplete="new-password"
        />
        <PasswordInput
          label="새 비밀번호 확인"
          value={form.confirm}
          onChange={(event) => update('confirm')(event.target.value)}
          errorMessage={errors.confirm}
          autoComplete="new-password"
        />
        <p className="text-body-s text-text-secondary">
          새 비밀번호는 현재 비밀번호와 달라야 하며, 변경 즉시 다른 기기에서는 로그아웃됩니다.
        </p>
      </div>
    </FormModal>
  )
}
