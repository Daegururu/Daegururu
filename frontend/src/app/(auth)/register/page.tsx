"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";

const FIELDS: { name: keyof FormState; label: string; type?: string }[] = [
  { name: "business_name", label: "가게 이름" },
  { name: "business_reg_no", label: "사업자등록번호 (000-00-00000)" },
  { name: "representative_name", label: "대표자명" },
  { name: "industry_code", label: "업종 코드" },
  { name: "region_code", label: "지역 코드" },
  { name: "open_date", label: "개업일", type: "date" },
  { name: "phone", label: "전화번호" },
  { name: "login_id", label: "로그인 아이디" },
  { name: "password", label: "비밀번호", type: "password" },
];

interface FormState {
  business_name: string;
  business_reg_no: string;
  representative_name: string;
  industry_code: string;
  region_code: string;
  open_date: string;
  phone: string;
  login_id: string;
  password: string;
}

const INITIAL: FormState = {
  business_name: "",
  business_reg_no: "",
  representative_name: "",
  industry_code: "",
  region_code: "",
  open_date: "",
  phone: "",
  login_id: "",
  password: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/api/v1/auth/register", form);
      router.push("/onboarding/store-info");
    } catch (err) {
      setError(err instanceof ApiError ? "이미 등록된 계정 또는 사업자번호입니다." : "가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center min-h-screen py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-zinc-900">가게 등록하기</h1>

        {FIELDS.map((field) => (
          <div key={field.name} className="space-y-1">
            <label className="text-sm font-medium text-zinc-700">{field.label}</label>
            <input
              type={field.type ?? "text"}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              value={form[field.name]}
              onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              required
            />
          </div>
        ))}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-zinc-900 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "가입 중..." : "가입하고 시작하기"}
        </button>
      </form>
    </div>
  );
}
