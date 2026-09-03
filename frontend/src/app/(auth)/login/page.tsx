"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/api/v1/auth/login", { login_id: loginId, password });
      router.push("/home");
    } catch (err) {
      setError(err instanceof ApiError ? "아이디 또는 비밀번호가 올바르지 않습니다." : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-zinc-900">대구르르 로그인</h1>

        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-700">아이디</label>
          <input
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-700">비밀번호</label>
          <input
            type="password"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-zinc-900 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <p className="text-center text-sm text-zinc-500">
          계정이 없으신가요?{" "}
          <Link href="/register" className="font-medium text-zinc-900">
            가게 등록하기
          </Link>
        </p>
      </form>
    </div>
  );
}
