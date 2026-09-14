import { cn } from '@/utils/cn'

export interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

/** 표 아래 페이지 번호입니다. 현재 페이지는 브랜드색으로 칠합니다. */
export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  const buttonClass =
    'flex h-[34px] min-w-[34px] items-center justify-center rounded-md px-3 text-body-m transition-colors disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <nav aria-label="페이지" className="flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={cn(buttonClass, 'text-text-secondary hover:bg-bg-subtle')}
      >
        ‹
      </button>

      {pages.map((number) => (
        <button
          key={number}
          type="button"
          aria-current={number === page ? 'page' : undefined}
          onClick={() => onChange(number)}
          className={cn(
            buttonClass,
            number === page
              ? 'bg-brand-primary font-medium text-text-inverse'
              : 'text-text-secondary hover:bg-bg-subtle',
          )}
        >
          {number}
        </button>
      ))}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className={cn(buttonClass, 'text-text-secondary hover:bg-bg-subtle')}
      >
        ›
      </button>
    </nav>
  )
}
