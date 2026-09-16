import { useEffect, useState } from 'react'

import { getAllTransactions, getSalesSummary } from '@/apis/sales'
import { StatusCard } from '@/components/common'
import { AppLayout } from '@/components/layout'
import { AddTransactionModal } from '@/features/sales/components/AddTransactionModal'
import { ExportModal } from '@/features/sales/components/ExportModal'
import { Pagination } from '@/features/sales/components/Pagination'
import { SalesFilterBar, type SalesFilters } from '@/features/sales/components/SalesFilterBar'
import {
  SalesPrintSummary,
  type SalesPrintData,
} from '@/features/sales/components/SalesPrintSummary'
import { SalesSummaryCards } from '@/features/sales/components/SalesSummaryCards'
import { TransactionTable } from '@/features/sales/components/TransactionTable'
import {
  useAddTransaction,
  useSalesSummary,
  useTransactions,
} from '@/features/sales/hooks/useSales'
import { toTransaction } from '@/features/sales/mapping'
import type { ExportOptions, NewTransaction, SalesSummaryItem } from '@/features/sales/types'
import { useToast } from '@/hooks/useToast'
import { useAuthStore } from '@/stores/authStore'
import { toCalendarDate, toCalendarMonth } from '@/utils/date'

type OpenModal = 'add' | 'export' | null

const INITIAL_FILTERS: SalesFilters = {
  month: toCalendarMonth(new Date()),
  category: 'all',
  settlement: 'all',
}

/** 요약을 받기 전에도 3열 자리를 잡아 두어 표가 튀지 않게 합니다. */
const SUMMARY_PLACEHOLDER: SalesSummaryItem[] = ['총매출', '수수료', '실정산액'].map((label) => ({
  label,
  value: '—',
  caption: '불러오는 중',
}))

/** 06 매출·정산. 06b(거래 추가)·06c(내보내기)는 모달, 06d(필터 펼침)는 셀렉트 상태입니다. */
export function SalesPage() {
  const user = useAuthStore((state) => state.user)
  const userLabel = user ? `${user.representativeName} 사장님` : ''
  const { showToast } = useToast()

  const [filters, setFilters] = useState<SalesFilters>(INITIAL_FILTERS)
  const [page, setPage] = useState(1)
  const [openModal, setOpenModal] = useState<OpenModal>(null)

  const transactions = useTransactions({ ...filters, page })
  const summary = useSalesSummary(filters.month)
  const addTransaction = useAddTransaction()

  // 필터가 바뀌면 1페이지로 돌아갑니다.
  const handleFilterChange = (next: SalesFilters) => {
    setFilters(next)
    setPage(1)
  }

  const handleAdd = async (transaction: NewTransaction) => {
    await addTransaction.mutateAsync(transaction)
    setOpenModal(null)
    setPage(1)
    showToast('거래를 추가했습니다')
  }

  // 인쇄용 데이터. 값이 들어오면 요약본이 그려지고, 그 다음 프레임에 인쇄 대화상자를 엽니다.
  const [printData, setPrintData] = useState<SalesPrintData | null>(null)
  const [exporting, setExporting] = useState(false)

  const handleExport = async ({ period, includes }: ExportOptions) => {
    setExporting(true)
    try {
      const [rows, summaryResponse] = await Promise.all([
        getAllTransactions(period),
        getSalesSummary(period),
      ])
      setPrintData({
        period,
        includes,
        transactions: rows.map(toTransaction),
        summary: summaryResponse.items,
        owner: userLabel,
        generatedAt: toCalendarDate(new Date()),
      })
      setOpenModal(null)
    } catch (error) {
      showToast(error instanceof Error ? error.message : '내보내기 데이터를 불러오지 못했습니다')
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    if (!printData) return

    // 브라우저 "PDF로 저장"의 기본 파일명은 document.title이라 기간을 넣어 둡니다.
    const originalTitle = document.title
    document.title = `매출정산_요약본_${printData.period}`

    const handleAfterPrint = () => {
      document.title = originalTitle
      setPrintData(null)
    }
    window.addEventListener('afterprint', handleAfterPrint)

    // 요약본이 DOM에 그려진 뒤 인쇄해야 하므로 한 프레임 미룹니다.
    const frame = requestAnimationFrame(() => window.print())

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('afterprint', handleAfterPrint)
      document.title = originalTitle
    }
  }, [printData])

  const renderTable = () => {
    if (transactions.isPending) {
      return <StatusCard loading loadingMessage="거래 내역을 불러오는 중이에요..." />
    }
    if (transactions.isError) {
      return (
        <StatusCard
          errorMessage={transactions.error.message}
          onRetry={() => transactions.refetch()}
        />
      )
    }
    return (
      <>
        <TransactionTable transactions={transactions.data.items} />
        <Pagination
          page={transactions.data.page}
          totalPages={transactions.data.totalPages}
          onChange={setPage}
        />
      </>
    )
  }

  return (
    <>
      {/* 인쇄할 때는 앱 레이아웃 대신 아래 요약본만 나옵니다. */}
      <div className="contents print:hidden">
        <AppLayout title="매출·정산" user={userLabel}>
          <SalesFilterBar
            filters={filters}
            onChange={handleFilterChange}
            onExport={() => setOpenModal('export')}
            onAdd={() => setOpenModal('add')}
          />

          {summary.isError ? (
            <StatusCard errorMessage={summary.error.message} onRetry={() => summary.refetch()} />
          ) : (
            <SalesSummaryCards items={summary.data ?? SUMMARY_PLACEHOLDER} />
          )}

          {renderTable()}

          <AddTransactionModal
            open={openModal === 'add'}
            onClose={() => setOpenModal(null)}
            onSubmit={handleAdd}
          />
          {/* 필터의 달이 바뀌면 기간 초기값도 따라가도록 key로 다시 만듭니다. */}
          <ExportModal
            key={filters.month}
            open={openModal === 'export'}
            month={filters.month}
            exporting={exporting}
            onClose={() => setOpenModal(null)}
            onExport={handleExport}
          />
        </AppLayout>
      </div>

      {printData && <SalesPrintSummary {...printData} />}
    </>
  )
}
