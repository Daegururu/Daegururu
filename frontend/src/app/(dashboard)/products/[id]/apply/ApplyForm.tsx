"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function ApplyForm({ productId }: { productId: number }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/v1/products/applications", {
        product_id: productId,
        applied_amount: amount,
        documents: [],
      });
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-zinc-200 bg-white py-24">
        <p className="text-lg font-bold text-zinc-900">신청이 접수되었습니다</p>
        <button
          onClick={() => router.push("/products")}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white"
        >
          상품 목록으로
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
      <h1 className="font-bold text-zinc-900">신청 금액 입력</h1>
      <input
        type="number"
        required
        placeholder="희망 신청 금액"
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-zinc-900 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {submitting ? "신청 중..." : "신청 제출"}
      </button>
    </form>
  );
}
