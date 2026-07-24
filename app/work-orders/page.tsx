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
  완료: "bg-tint-emerald text-tint-emerald-fg",
};

const FILTERS = ["전체", "대기", "진행중", "완료"] as const;

export default function WorkOrdersPage() {
  const [orders, setOrders] = useState(WORK_ORDERS);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("전체");

  const advance = (id: string) =>
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && NEXT[o.status] ? { ...o, status: NEXT[o.status]!.to } : o
      )
    );

  const doneCount = orders.filter((o) => o.status === "완료").length;
  const shown =
    filter === "전체" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <h1 className="mt-3 text-[24px] font-extrabold tracking-[-0.02em]">
        내 작업
      </h1>
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

      <div className="mt-4 flex gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold transition-colors ${
              filter === f ? "bg-ink text-white" : "bg-card text-sub"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {shown.map((o, i) => (
          <div
            key={o.id}
            className="rise rounded-[20px] bg-card p-4"
            style={{ animationDelay: `${i * 60}ms` }}
          >
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
                className="mt-3.5 w-full rounded-xl bg-brand-soft py-3 text-sm font-bold text-brand transition-transform active:scale-[0.98]"
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
