"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { DiagnosisReport } from "@/lib/types";

const RISK_COLOR: Record<string, string> = {
  안전: "text-emerald-600 bg-emerald-50",
  주의: "text-amber-600 bg-amber-50",
  위험: "text-red-600 bg-red-50",
};

export default function HomePage() {
  const [report, setReport] = useState<DiagnosisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function load() {
    setLoading(true);
    setNotFound(false);
    try {
      const data = await api.get<DiagnosisReport>("/api/v1/diagnosis/latest");
      setReport(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function runDiagnosis() {
    setRunning(true);
    try {
      const data = await api.post<DiagnosisReport>("/api/v1/diagnosis/run");
      setReport(data);
      setNotFound(false);
    } finally {
      setRunning(false);
    }
  }

  if (loading) return <p className="text-sm text-zinc-500">불러오는 중...</p>;

  if (notFound || !report) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-zinc-200 bg-white py-24">
        <p className="text-zinc-600">아직 진단 리포트가 없습니다.</p>
        <button
          onClick={runDiagnosis}
          disabled={running}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {running ? "진단 실행 중..." : "지금 진단 실행하기"}
        </button>
      </div>
    );
  }

  const areaLabels: Record<string, string> = {
    sales: "매출",
    cost_structure: "비용구조",
    cashflow: "현금흐름",
    settlement: "정산",
    relative_position: "상대위치",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-6">
        <div>
          <p className="text-sm text-zinc-500">종합 진단 점수</p>
          <p className="text-4xl font-bold text-zinc-900">{report.composite_score}점</p>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${RISK_COLOR[report.risk_level]}`}>
          {report.risk_level}
        </span>
        <button
          onClick={runDiagnosis}
          disabled={running}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 disabled:opacity-50"
        >
          {running ? "재진단 중..." : "다시 진단하기"}
        </button>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {Object.entries(report.sub_scores).map(([area, score]) => (
          <div key={area} className="rounded-xl border border-zinc-200 bg-white p-4 text-center">
            <p className="text-xs text-zinc-500">{areaLabels[area] ?? area}</p>
            <p className="text-2xl font-bold text-zinc-900">{score}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-3 font-semibold text-zinc-900">왜 이 점수인가요?</h2>
        <ul className="space-y-3">
          {report.causes.map((cause) => (
            <li key={cause.cause_id} className="border-l-2 border-zinc-900 pl-3">
              <p className="text-sm font-medium text-zinc-800">{cause.summary}</p>
              <p className="text-xs text-zinc-500">{cause.evidence.join(" · ")}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-3 font-semibold text-zinc-900">맞춤 처방</h2>
        <ul className="space-y-2">
          {report.prescriptions.map((p) => (
            <li key={p.prescription_id} className="flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3">
              <span className="text-sm font-medium text-zinc-800">
                {p.rank}. {p.title}
              </span>
              <span className="text-xs text-zinc-500">{p.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
