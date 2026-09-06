import { useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react'

import { cn } from '@/utils/cn'

/**
 * accept 목록에 맞는 파일인지 확인합니다.
 * 브라우저가 MIME 타입을 비워 보내는 경우가 있어 확장자도 함께 봅니다.
 */
function isAcceptedFile(file: File, accept: string): boolean {
  const rules = accept
    .split(',')
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)

  if (rules.length === 0) return true

  const fileType = file.type.toLowerCase()
  const fileName = file.name.toLowerCase()

  return rules.some((rule) => {
    if (rule.startsWith('.')) return fileName.endsWith(rule)
    if (rule.endsWith('/*')) return fileType.startsWith(rule.slice(0, -1))
    return fileType === rule
  })
}

export interface FileDropzoneProps {
  label?: string
  /** 업로드된 파일. 값이 있으면 완료 상태로 표시됩니다. */
  file?: File | null
  onFileSelect: (file: File) => void
  onFileClear?: () => void
  /** 허용할 파일 형식. 기본값은 PDF만 허용 */
  accept?: string
  /** 허용되지 않는 형식을 올렸을 때 보여줄 문구 */
  rejectMessage?: string
  /** 드롭존 아래 안내 문구 */
  helperText?: string
  title?: string
  description?: string
  className?: string
}

export function FileDropzone({
  label,
  file,
  onFileSelect,
  onFileClear,
  accept = 'application/pdf',
  rejectMessage = 'PDF 파일만 업로드할 수 있습니다',
  helperText,
  title = '파일을 업로드하세요',
  description,
  className,
}: FileDropzoneProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isRejected, setRejected] = useState(false)

  /** 파일 선택과 드롭 모두 이 검사를 거칩니다. */
  const acceptFile = (candidate: File) => {
    if (!isAcceptedFile(candidate, accept)) {
      setRejected(true)
      return
    }

    setRejected(false)
    onFileSelect(candidate)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    if (selected) acceptFile(selected)
    // 같은 파일을 다시 선택해도 change가 발생하도록 값을 비웁니다.
    event.target.value = ''
  }

  // accept 속성은 파일 선택 창에만 적용되므로 드롭한 파일은 직접 검사합니다.
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const dropped = event.dataTransfer.files?.[0]
    if (dropped) acceptFile(dropped)
  }

  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {label && (
        <label htmlFor={id} className="text-body-s font-medium text-text-secondary">
          {label}
        </label>
      )}

      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="sr-only"
      />

      <div
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        className={cn(
          'flex w-full flex-col items-center justify-center gap-1.5 rounded-md p-5',
          'border-[1.5px] border-dashed transition-colors',
          isRejected
            ? 'border-status-danger bg-status-danger-bg'
            : file
              ? 'border-brand-primary bg-brand-subtle'
              : 'border-border-strong bg-bg-canvas',
        )}
      >
        {file ? (
          <div className="flex w-full items-center gap-3">
            <span
              aria-hidden
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-status-safe text-body-s font-bold text-text-inverse"
            >
              ✓
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-m font-medium text-text-primary">{file.name}</p>
              <p className="text-caption text-text-secondary">
                업로드 완료 · 사업자 정보를 자동으로 인식했습니다
              </p>
            </div>
            <button
              type="button"
              onClick={() => (onFileClear ? onFileClear() : inputRef.current?.click())}
              className="shrink-0 text-body-s font-medium text-text-brand underline-offset-2 hover:underline"
            >
              다시 업로드
            </button>
          </div>
        ) : (
          <>
            <span aria-hidden className="text-[22px]">
              📄
            </span>
            <p className="text-center text-body-m font-medium text-text-primary">{title}</p>
            {description && (
              <p className="text-center text-caption text-text-secondary">{description}</p>
            )}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className={cn(
                'rounded-md border border-border-default bg-bg-surface px-4 py-2',
                'text-body-s font-medium text-text-primary transition-colors hover:bg-bg-subtle',
              )}
            >
              파일 선택
            </button>
          </>
        )}
      </div>

      {isRejected ? (
        <p role="alert" className="text-caption text-status-danger">
          {rejectMessage}
        </p>
      ) : (
        helperText && <p className="text-caption text-text-secondary">{helperText}</p>
      )}
    </div>
  )
}
