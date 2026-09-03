"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { FinancialProduct } from "@/lib/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<FinancialProduct[]>([]);

  useEffect(() => {
    api.get<FinancialProduct[]>("/api/v1/products").then(setProducts);
  }, []);

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-bold text-zinc-900">금융상품 추천</h1>
      {products.map((p) => (
        <Link
          key={p.product_id}
          href={`/products/${p.product_id}`}
          className="block rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-400"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-zinc-900">{p.name}</p>
              <p className="text-sm text-zinc-500">
                {p.provider} · {p.type} · 연 {Number(p.interest_rate)}%
              </p>
            </div>
            <p className="text-sm font-medium text-zinc-700">
              최대 {Number(p.limit_amount).toLocaleString()}원
            </p>
          </div>
        </Link>
      ))}
      {products.length === 0 && <p className="text-sm text-zinc-500">등록된 상품이 없습니다.</p>}
    </div>
  );
}
