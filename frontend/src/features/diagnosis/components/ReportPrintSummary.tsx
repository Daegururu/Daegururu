import type { CauseAnalysis, Prescription, ReportSummary } from '@/features/diagnosis/types'
import type {
  DiagnosisFixedCost,
  DiagnosisMonthlySeries,
  DiagnosisSettlement,
} from '@/types/diagnosis'
import { formatWon } from '@/utils/format'

export interface ReportPrintData {
  summary: ReportSummary
  cause: CauseAnalysis
  prescriptions: Prescription[]
  /** 탭 4종은 화면에서 보던 탭만 받아 둔 상태라, 인쇄할 때 네 개를 모두 새로 받아 넘깁니다. */
  sales: DiagnosisMonthlySeries
  fixedCost: DiagnosisFixedCost
  cashFlow: DiagnosisMonthlySeries
  settlement: DiagnosisSettlement
  /** 머리글에 쓸 사용자 표기. 예: "김영수 사장님" */
  owner: string
  /** 생성 일자 YYYY-MM-DD */
  generatedAt: string
}

/** "2026-09" → "2026년 9월" */
function toMonthLabel(yearMonth: string): string {
  return `${yearMonth.slice(0, 4)}년 ${Number(yearMonth.slice(5, 7))}월`
}

/**
 * 04 진단 리포트의 인쇄 전용 요약본입니다. 화면에는 보이지 않고 window.print()로만 나옵니다.
 * 앱 레이아웃은 @media print에서 숨기므로 여기서는 종이에 맞는 흑백 표만 그립니다.
 *
 * 화면은 탭 하나만 보여주지만 종이에는 네 탭을 모두 담습니다. 리포트를 통째로 첨부하는 용도라서입니다.
 */
export function ReportPrintSummary({
  summary,
  cause,
  prescriptions,
  sales,
  fixedCost,
  cashFlow,
  settlement,
  owner,
  generatedAt,
}: ReportPrintData) {
  return (
    <article className="print-summary hidden flex-col gap-8 bg-white p-8 text-[11pt] leading-relaxed text-black print:flex">
      <header className="flex flex-col gap-1 border-b-2 border-black pb-4">
        <h1 className="text-[18pt] font-bold">{summary.title}</h1>
        <p>{summary.meta}</p>
        <p className="text-[9pt] text-neutral-600">
          {owner} · 생성일 {generatedAt} · 대구루루
        </p>
      </header>

      <section className="flex flex-col gap-2 break-inside-avoid">
        <h2 className="text-[13pt] font-bold">종합 위험 점수</h2>
        <div className="flex items-baseline gap-3 border border-neutral-400 p-3">
          <span className="text-[24pt] font-bold tabular-nums">{summary.score}</span>
          <span className="text-[11pt]">/ 100</span>
          <span className="ml-auto text-[13pt] font-bold">{summary.levelLabel}</span>
        </div>
      </section>

      <MonthlySection title="매출 추이" series={sales} />

      <section className="flex flex-col gap-2 break-inside-avoid">
        <h2 className="text-[13pt] font-bold">고정비</h2>
        {!fixedCost.hasData || fixedCost.items.length === 0 ? (
          <EmptyRow />
        ) : (
          <table className="w-full border-collapse text-[10pt]">
            <thead>
              <tr className="border-y border-black bg-neutral-100">
                <th scope="col" className="px-2 py-1.5 text-left font-medium">
                  항목
                </th>
                <th scope="col" className="px-2 py-1.5 text-right font-medium">
                  금액
                </th>
                <th scope="col" className="px-2 py-1.5 text-right font-medium">
                  비중
                </th>
              </tr>
            </thead>
            <tbody>
              {fixedCost.items.map(({ category, amount, pct }) => (
                <tr key={category} className="border-b border-neutral-300">
                  <td className="px-2 py-1.5">{category}</td>
                  <td className="px-2 py-1.5 text-right tabular-nums">{formatWon(amount)}</td>
                  <td className="px-2 py-1.5 text-right tabular-nums">{pct}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-black font-bold">
                <td className="px-2 py-1.5">합계</td>
                <td className="px-2 py-1.5 text-right tabular-nums">
                  {formatWon(fixedCost.items.reduce((sum, item) => sum + item.amount, 0))}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </section>

      <MonthlySection title="현금흐름" series={cashFlow} amountLabel="순현금흐름" />

      <section className="flex flex-col gap-2 break-inside-avoid">
        <h2 className="text-[13pt] font-bold">정산</h2>
        {!settlement.hasData ? (
          <EmptyRow />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Stat label="평균 수수료율" value={`${settlement.avgFeeRatePct}%`} />
            <Stat label="평균 정산 소요일" value={`${settlement.avgSettlementLagDays}일`} />
          </div>
        )}
      </section>

      <section className="flex flex-col gap-2 break-inside-avoid">
        <h2 className="text-[13pt] font-bold">원인 분석</h2>
        {cause.descriptions.map((description, index) => (
          <p key={index}>{description}</p>
        ))}
        {cause.evidences.length > 0 && (
          <ul className="list-disc pl-5 text-[10pt] text-neutral-700">
            {cause.evidences.map((evidence, index) => (
              <li key={index}>{evidence}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3 break-inside-avoid">
        <h2 className="text-[13pt] font-bold">맞춤 처방</h2>
        {prescriptions.map(({ id, title, description }, index) => (
          <div key={id} className="flex flex-col gap-0.5 border-l-2 border-black pl-3">
            <p className="font-bold">
              {index + 1}. {title}
            </p>
            <p className="text-[10pt]">{description}</p>
          </div>
        ))}
      </section>

      <footer className="mt-auto border-t border-neutral-400 pt-3 text-[9pt] text-neutral-600">
        본 리포트는 대구루루에 기록된 매출·고정비·정산 데이터를 기준으로 생성되었으며, 정책자금 신청
        첨부용으로 활용할 수 있습니다.
      </footer>
    </article>
  )
}

/** 매출 추이·현금흐름처럼 월별 금액이 이어지는 표입니다. */
function MonthlySection({
  title,
  series,
  amountLabel = '금액',
}: {
  title: string
  series: DiagnosisMonthlySeries
  amountLabel?: string
}) {
  return (
    <section className="flex flex-col gap-2 break-inside-avoid">
      <h2 className="text-[13pt] font-bold">{title}</h2>
      {!series.hasData || series.months.length === 0 ? (
        <EmptyRow />
      ) : (
        <table className="w-full border-collapse text-[10pt]">
          <thead>
            <tr className="border-y border-black bg-neutral-100">
              <th scope="col" className="px-2 py-1.5 text-left font-medium">
                월
              </th>
              <th scope="col" className="px-2 py-1.5 text-right font-medium">
                {amountLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {series.months.map((month, index) => (
              <tr key={month} className="border-b border-neutral-300">
                <td className="px-2 py-1.5 whitespace-nowrap">{toMonthLabel(month)}</td>
                <td className="px-2 py-1.5 text-right whitespace-nowrap tabular-nums">
                  {formatWon(series.values[index] ?? 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border border-neutral-400 p-3">
      <span className="text-[9pt] text-neutral-600">{label}</span>
      <span className="text-[14pt] font-bold">{value}</span>
    </div>
  )
}

function EmptyRow() {
  return <p className="border border-neutral-400 p-3 text-neutral-600">아직 데이터가 없습니다</p>
}
