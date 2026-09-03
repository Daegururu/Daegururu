"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { FinancialProduct } from "@/lib/types";

export function ProductDetail({ productId }: { productId: number }) {
  const [product, setProduct] = useState<FinancialProduct | null>(null);

  useEffect(() => {
    api.get<FinancialProduct>(`/api/v1/products/${productId}`).then(setProduct);
  }, [productId]);

  if (!product) return <p className="text-sm text-zinc-500">불러오는 중...</p>;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h1 className="text-xl font-bold text-zinc-900">{product.name}</h1>
        <p className="text-sm text-zinc-500">{product.provider} · {product.type}</p>

        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <Info label="한도" value={`${Number(product.limit_amount).toLocaleString()}원`} />
          <Info label="금리" value={`연 ${Number(product.interest_rate)}%`} />
          <Info label="기간" value={`${product.period_years}년 (거치 ${product.grace_period_years}년)`} />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-2 font-semibold text-zinc-900">필요 서류</h2>
        <ul className="list-inside list-disc text-sm text-zinc-600">
          {product.required_documents.map((doc) => (
            <li key={doc}>{doc}</li>
          ))}
        </ul>
      </div>

      <Link
        href={`/products/${productId}/apply`}
        className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
      >
        신청하기
      </Link>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="font-medium text-zinc-900">{value}</p>
    </div>
  );
}
