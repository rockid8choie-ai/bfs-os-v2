"use client";

import { useState } from "react";
import { WORK_ORDERS, type WoStatus } from "@/lib/mock";

const NEXT: Record<WoStatus, { label: string; to: WoStatus } | null> = {
  대기: { label: "시작", to: "진행중" },
  진행중: { label: "완료 처리", to: "완료" },
  완료: null,
};

const BADGE: Record<WoStatus, string> = {
  대기: "bg-line text-ink2",
  진행중: "bg-brand-soft text-brand",
  완료: "bg-emerald-50 text-emerald-600",
};

export default function WorkOrdersPage() {
  const [orders, setOrders] = useState(WORK_ORDERS);

  const advance = (id: string) =>
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && NEXT[o.status] ? { ...o, status: NEXT[o.status]!.to } : o
      )
    );

  const doneCount = orders.filter((o) => o.status === "완료").length;

  return (
    <div>
      <h1 className="mt-3 text-[22px] font-bold tracking-tight">내 작업</h1>
      <p className="mt-1 text-sm text-sub">
        오늘 {orders.length}건 중{" "}
        <b className="text-ink">{doneCount}건</b> 완료
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-card">
        <div
          className="h-full rounded-full bg-brand transition-all duration-500"
          style={{ width: `${(doneCount / orders.length) * 100}%` }}
        />
      </div>

      <div className="mt-5 space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-[20px] bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-semibold leading-snug">{o.title}</div>
                <div className="mt-0.5 text-[13px] text-sub">
                  {o.location} · 마감 {o.due} · {o.source}
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${BADGE[o.status]}`}
              >
                {o.status}
              </span>
            </div>
            {NEXT[o.status] && (
              <button
                onClick={() => advance(o.id)}
                className="mt-3.5 w-full rounded-xl bg-brand py-3 text-sm font-bold text-white active:opacity-80"
              >
                {NEXT[o.status]!.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
