import Link from "next/link";

export default function StoreInfoPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-xl font-bold">02a 가게 정보 (준비 중)</h1>
      <Link href="/onboarding/sales-connect" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white">
        다음
      </Link>
    </div>
  );
}
