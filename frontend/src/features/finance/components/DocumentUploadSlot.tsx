import { useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react'

import { cn } from '@/utils/cn'

const ACCEPT = 'application/pdf,image/jpeg'
const MAX_SIZE = 10 * 1024 * 1024

export interface DocumentUploadSlotProps {
  label: string
  /** 슬롯 안내 문구. 예: "국세청 홈택스에서 발급" */
  hint: string
  file: File | null
  onFileSelect: (file: File) => void
}

/**
 * 09 서류 업로드 슬롯. 클릭하거나 파일을 끌어다 놓습니다.
 * FileDropzone과 달리 PDF·JPG 둘 다 받고 10MB 제한이 있어 따로 둡니다.
 */
export function DocumentUploadSlot({ label, hint, file, onFileSelect }: DocumentUploadSlotProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  const acceptFile = (candidate: File) => {
    const isAllowedType = candidate.type === 'application/pdf' || candidate.type === 'image/jpeg'
    if (!isAllowedType) {
      setError('PDF 또는 JPG 파일만 올릴 수 있습니다')
      return
    }
    if (candidate.size > MAX_SIZE) {
      setError('파일당 10MB 이하만 올릴 수 있습니다')
      return
    }
    setError('')
    onFileSelect(candidate)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    if (selected) acceptFile(selected)
    // 같은 파일을 다시 선택해도 change가 발생하도록 값을 비웁니다.
    event.target.value = ''
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const dropped = event.dataTransfer.files?.[0]
    if (dropped) acceptFile(dropped)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleChange}
        className="sr-only"
      />

      <div
        role="button"
        tabIndex={0}
        aria-label={`${label} 업로드`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed px-5 py-6 text-center transition-colors',
          'focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:outline-none',
          error
            ? 'border-status-danger bg-status-danger-bg'
            : file
              ? 'border-brand-primary bg-brand-subtle'
              : 'border-border-strong bg-bg-subtle hover:bg-bg-canvas',
        )}
      >
        {file ? (
          <>
            <span
              aria-hidden
              className="flex size-7 items-center justify-center rounded-full bg-status-safe text-body-s font-bold text-text-inverse"
            >
              ✓
            </span>
            <p className="text-body-m font-medium text-text-primary">{label}</p>
            <p className="max-w-full truncate text-caption text-text-secondary">{file.name}</p>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                inputRef.current?.click()
              }}
              className="text-body-s font-medium text-text-brand underline-offset-2 hover:underline"
            >
              다시 올리기
            </button>
          </>
        ) : (
          <>
            <span aria-hidden className="text-heading-s font-bold text-text-tertiary">
              ⬆
            </span>
            <p className="text-body-m font-medium text-text-primary">{label}</p>
            <p className="text-caption text-text-tertiary">
              {hint} · 클릭하거나 파일을 끌어다 놓으세요
            </p>
          </>
        )}
      </div>

      {error && (
        <p role="alert" className="text-caption text-status-danger">
          {error}
        </p>
      )}
    </div>
  )
}
