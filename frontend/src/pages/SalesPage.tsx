import { useState } from 'react'

import { AppLayout } from '@/components/layout'
import { AddTransactionModal } from '@/features/sales/components/AddTransactionModal'
import { ExportModal } from '@/features/sales/components/ExportModal'
import { Pagination } from '@/features/sales/components/Pagination'
import { SalesFilterBar, type SalesFilters } from '@/features/sales/components/SalesFilterBar'
import { SalesSummaryCards } from '@/features/sales/components/SalesSummaryCards'
import { TransactionTable } from '@/features/sales/components/TransactionTable'
import {
  MOCK_SUMMARY_BY_MONTH,
  MOCK_TRANSACTIONS,
  MOCK_USER,
  PAGE_SIZE,
} from '@/features/sales/mockData'
import type { NewTransaction, Transaction } from '@/features/sales/types'

type OpenModal = 'add' | 'export' | null

const INITIAL_FILTERS: SalesFilters = {
  month: '2026-08',
  category: 'all',
  settlement: 'all',
}

/** 06 매출·정산. 06b(거래 추가)·06c(내보내기)는 모달, 06d(필터 펼침)는 셀렉트 상태입니다. */
export function SalesPage() {
  // TODO: 거래 내역·요약 API 연동. 지금은 전부 목데이터이고 추가한 거래는 화면에서만 유지됩니다.
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)
  const [filters, setFilters] = useState<SalesFilters>(INITIAL_FILTERS)
  const [page, setPage] = useState(1)
  const [openModal, setOpenModal] = useState<OpenModal>(null)

  const filtered = transactions.filter(
    ({ date, category, settlement }) =>
      date.startsWith(filters.month) &&
      (filters.category === 'all' || category === filters.category) &&
      (filters.settlement === 'all' || settlement === filters.settlement),
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  // 필터가 바뀌면 1페이지로 돌아갑니다.
  const handleFilterChange = (next: SalesFilters) => {
    setFilters(next)
    setPage(1)
  }

  const handleAdd = ({ category, date, amount, content, method }: NewTransaction) => {
    const signedAmount = category === 'expense' ? -amount : amount
    setTransactions((prev) => [
      {
        id: `t-${Date.now()}`,
        date,
        category,
        method: category === 'expense' ? '고정비' : method,
        content,
        amount: signedAmount,
        // 직접 넣은 현금 거래는 카드사 정산 대상이 아닙니다.
        settlement: category === 'expense' ? 'withdrawn' : 'none',
      },
      ...prev,
    ])
    setOpenModal(null)
    setPage(1)
  }

  // TODO: PDF 내보내기 API 연동. 지금은 모달만 닫습니다.
  const handleExport = () => setOpenModal(null)

  return (
    <AppLayout title="매출·정산" user={MOCK_USER}>
      <SalesFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onExport={() => setOpenModal('export')}
        onAdd={() => setOpenModal('add')}
      />

      <SalesSummaryCards items={MOCK_SUMMARY_BY_MONTH[filters.month]} />

      <TransactionTable transactions={pageItems} />

      <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />

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
        onClose={() => setOpenModal(null)}
        onExport={handleExport}
      />
    </AppLayout>
  )
}
