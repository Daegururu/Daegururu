import Link from "next/link";

export default function DiagnosisStartPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-xl font-bold">02c 진단 시작 (준비 중)</h1>
      <Link href="/home" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white">
        진단 시작하고 홈으로
      </Link>
    </div>
  );
}
