"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Transaction } from "@/lib/types";

const TYPES = ["매출", "고정비", "변동비"] as const;

export default function TransactionsPage() {
  const [rows, setRows] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<{ total_sales: number; total_fees: number; net_settlement: number } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", type: "매출" as (typeof TYPES)[number], category: "", amount: "" });

  async function load() {
    const [tx, sum] = await Promise.all([
      api.get<Transaction[]>("/api/v1/transactions"),
      api.get<{ total_sales: number; total_fees: number; net_settlement: number }>("/api/v1/transactions/summary"),
    ]);
    setRows(tx);
    setSummary(sum);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/api/v1/transactions", {
      date: form.date,
      type: form.type,
      category: form.category || null,
      amount: form.amount,
    });
    setShowForm(false);
    setForm({ date: "", type: "매출", category: "", amount: "" });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <SummaryTile label="총매출" value={summary?.total_sales} />
        <SummaryTile label="수수료" value={summary?.total_fees} />
        <SummaryTile label="실정산액" value={summary?.net_settlement} />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white">
        <div className="flex items-center justify-between p-4">
          <h2 className="font-semibold text-zinc-900">거래내역</h2>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white"
          >
            거래 추가
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="grid grid-cols-4 gap-2 border-t border-zinc-100 p-4">
            <input
              type="date"
              required
              className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <select
              className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as (typeof TYPES)[number] })}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              placeholder="카테고리 (선택)"
              className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <input
              type="number"
              placeholder="금액"
              required
              className="rounded-lg border border-zinc-300 px-2 py-1.5 text-sm"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <button type="submit" className="col-span-4 rounded-lg bg-zinc-900 py-1.5 text-sm text-white">
              저장
            </button>
          </form>
        )}

        <table className="w-full text-sm">
          <thead className="border-t border-zinc-100 text-left text-xs text-zinc-500">
            <tr>
              <th className="px-4 py-2">날짜</th>
              <th className="px-4 py-2">구분</th>
              <th className="px-4 py-2">카테고리</th>
              <th className="px-4 py-2 text-right">금액</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.transaction_id} className="border-t border-zinc-100">
                <td className="px-4 py-2">{t.date}</td>
                <td className="px-4 py-2">{t.type}</td>
                <td className="px-4 py-2">{t.category ?? "-"}</td>
                <td className="px-4 py-2 text-right">{Number(t.amount).toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-xl font-bold text-zinc-900">{value != null ? `${Number(value).toLocaleString()}원` : "-"}</p>
    </div>
  );
}
