"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

interface NotificationSetting {
  email: string | null;
  email_enabled: boolean;
}

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notif, setNotif] = useState<NotificationSetting | null>(null);

  useEffect(() => {
    api.get<User>("/api/v1/users/me").then(setUser);
    api.get<NotificationSetting>("/api/v1/users/me/notifications").then(setNotif);
  }, []);

  async function toggleNotification() {
    if (!notif) return;
    const updated = await api.patch<NotificationSetting>("/api/v1/users/me/notifications", {
      email: notif.email,
      email_enabled: !notif.email_enabled,
    });
    setNotif(updated);
  }

  async function handleLogout() {
    await api.post("/api/v1/auth/logout");
    router.push("/login");
  }

  if (!user) return <p className="text-sm text-zinc-500">불러오는 중...</p>;

  return (
    <div className="max-w-lg space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h1 className="mb-4 font-bold text-zinc-900">가게 정보</h1>
        <dl className="space-y-2 text-sm">
          <Row label="가게 이름" value={user.business_name} />
          <Row label="대표자명" value={user.representative_name} />
          <Row label="사업자등록번호" value={user.business_reg_no} />
          <Row label="전화번호" value={user.phone} />
        </dl>
      </div>

      {notif && (
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-6">
          <div>
            <p className="font-medium text-zinc-900">이메일 알림</p>
            <p className="text-xs text-zinc-500">{notif.email ?? "등록된 이메일 없음"}</p>
          </div>
          <button
            onClick={toggleNotification}
            className={`rounded-full px-4 py-1.5 text-xs font-medium ${
              notif.email_enabled ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {notif.email_enabled ? "켜짐" : "꺼짐"}
          </button>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="w-full rounded-lg border border-zinc-300 py-2 text-sm font-medium text-zinc-600"
      >
        로그아웃
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-zinc-100 pb-2">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="font-medium text-zinc-900">{value}</dd>
    </div>
  );
}
