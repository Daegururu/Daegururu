import Link from "next/link";

export default function SalesConnectPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-xl font-bold">02b 매출 연동 (준비 중)</h1>
      <Link href="/onboarding/diagnosis-start" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white">
        다음
      </Link>
    </div>
  );
}
