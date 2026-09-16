import { SETTLEMENT_LABEL } from '@/features/sales/constants'
import { formatMonthRangeLabel } from '@/features/sales/mapping'
import type {
  ExportIncludeKey,
  SalesMonth,
  SalesSummaryItem,
  Transaction,
} from '@/features/sales/types'
import { cn } from '@/utils/cn'
import { formatWon } from '@/utils/format'

export interface SalesPrintData {
  period: SalesMonth
  includes: Record<ExportIncludeKey, boolean>
  /** 기간의 거래 전체. 포함 항목별로 여기서 나눕니다. */
  transactions: Transaction[]
  summary: SalesSummaryItem[]
  /** 머리글에 쓸 사용자 표기. 예: "김영수 사장님" */
  owner: string
  /** 생성 일자 YYYY-MM-DD */
  generatedAt: string
}

interface SectionSpec {
  key: ExportIncludeKey
  title: string
  filter: (transaction: Transaction) => boolean
}

/** 내보내기 모달의 포함 항목과 같은 순서입니다. 정산 예정 내역은 정산 예정·미정산 매출만 모읍니다. */
const SECTIONS: SectionSpec[] = [
  { key: 'sales', title: '매출 내역', filter: (t) => t.category === 'sales' },
  { key: 'expense', title: '고정비·지출 내역', filter: (t) => t.category === 'expense' },
  {
    key: 'scheduled',
    title: '정산 예정 내역',
    filter: (t) => t.settlement === 'scheduled' || t.settlement === 'unsettled',
  },
]

const COLUMNS = ['거래일자', '구분', '내용', '금액', '정산상태'] as const

/**
 * 06c 내보내기의 인쇄 전용 요약본입니다. 화면에는 보이지 않고 window.print()로만 나옵니다.
 * 앱 레이아웃은 @media print에서 숨기므로 여기서는 종이에 맞는 흑백 표만 그립니다.
 */
export function SalesPrintSummary({
  period,
  includes,
  transactions,
  summary,
  owner,
  generatedAt,
}: SalesPrintData) {
  const sections = SECTIONS.filter(({ key }) => includes[key]).map((section) => ({
    ...section,
    rows: transactions.filter(section.filter),
  }))

  return (
    <article className="print-summary hidden flex-col gap-8 bg-white p-8 text-[11pt] leading-relaxed text-black print:flex">
      <header className="flex flex-col gap-1 border-b-2 border-black pb-4">
        <h1 className="text-[18pt] font-bold">매출·정산 요약본</h1>
        <p>{formatMonthRangeLabel(period)}</p>
        <p className="text-[9pt] text-neutral-600">
          {owner} · 생성일 {generatedAt} · 대구루루
        </p>
      </header>

      <section className="grid grid-cols-3 gap-4 break-inside-avoid">
        {summary.map(({ label, value, caption }) => (
          <div key={label} className="flex flex-col gap-0.5 border border-neutral-400 p-3">
            <span className="text-[9pt] text-neutral-600">{label}</span>
            <span className="text-[14pt] font-bold">{value}</span>
            <span className="text-[9pt] text-neutral-600">{caption}</span>
          </div>
        ))}
      </section>

      {sections.map(({ key, title, rows }) => {
        const total = rows.reduce((sum, { amount }) => sum + amount, 0)

        return (
          <section key={key} className="flex flex-col gap-2 break-inside-avoid">
            <h2 className="text-[13pt] font-bold">
              {title}{' '}
              <span className="text-[9pt] font-normal text-neutral-600">{rows.length}건</span>
            </h2>
            <table className="w-full border-collapse text-[10pt]">
              <thead>
                <tr className="border-y border-black bg-neutral-100">
                  {COLUMNS.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className={cn(
                        'px-2 py-1.5 text-left font-medium',
                        column === '금액' && 'text-right',
                      )}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className="px-2 py-4 text-center text-neutral-600">
                      해당 기간에 내역이 없습니다
                    </td>
                  </tr>
                ) : (
                  rows.map(({ id, date, method, content, amount, settlement }) => (
                    <tr key={id} className="border-b border-neutral-300">
                      <td className="px-2 py-1.5 whitespace-nowrap">{date}</td>
                      <td className="px-2 py-1.5 whitespace-nowrap">{method}</td>
                      <td className="px-2 py-1.5">{content}</td>
                      <td className="px-2 py-1.5 text-right whitespace-nowrap tabular-nums">
                        {formatWon(amount)}
                      </td>
                      <td className="px-2 py-1.5 whitespace-nowrap">
                        {SETTLEMENT_LABEL[settlement]}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {rows.length > 0 && (
                <tfoot>
                  <tr className="border-t border-black font-bold">
                    <td colSpan={3} className="px-2 py-1.5">
                      합계
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{formatWon(total)}</td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </section>
        )
      })}

      <footer className="mt-auto border-t border-neutral-400 pt-3 text-[9pt] text-neutral-600">
        본 요약본은 대구루루에 기록된 거래 내역을 기준으로 생성되었으며, 정책자금 신청 첨부용으로
        활용할 수 있습니다.
      </footer>
    </article>
  )
}
