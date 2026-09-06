import { useId, useRef, type ChangeEvent, type DragEvent } from 'react'

import { cn } from '@/utils/cn'

export interface FileDropzoneProps {
  label?: string
  /** 업로드된 파일. 값이 있으면 완료 상태로 표시됩니다. */
  file?: File | null
  onFileSelect: (file: File) => void
  onFileClear?: () => void
  /** input의 accept 속성. 기본값은 PDF만 허용 */
  accept?: string
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
  helperText,
  title = '파일을 업로드하세요',
  description,
  className,
}: FileDropzoneProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    if (selected) onFileSelect(selected)
    // 같은 파일을 다시 선택해도 change가 발생하도록 값을 비웁니다.
    event.target.value = ''
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const dropped = event.dataTransfer.files?.[0]
    if (dropped) onFileSelect(dropped)
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
          file ? 'border-brand-primary bg-brand-subtle' : 'border-border-strong bg-bg-canvas',
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

      {helperText && <p className="text-caption text-text-secondary">{helperText}</p>}
    </div>
  )
}
