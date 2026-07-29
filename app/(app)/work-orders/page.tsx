"use client";

import AssigneeRow from "@/components/AssigneeRow";
import { useApp, type Filter } from "@/lib/store";
import type { WoStatus } from "@/lib/mock";

const BADGE: Record<WoStatus, string> = {
  대기: "bg-danger-soft text-danger",
  배정됨: "bg-tint-amber text-tint-amber-fg",
  진행중: "bg-brand-soft text-brand",
  완료: "bg-tint-emerald text-tint-emerald-fg",
};

const FILTERS: Filter[] = ["전체", "대기", "배정됨", "진행중", "완료"];

export default function WorkOrdersPage() {
  const { visibleOrders, filter, setFilter, advance, openAssign, role, me } = useApp();

  const doneCount = visibleOrders.filter((o) => o.status === "완료").length;
  const total = visibleOrders.length;
  const shown =
    filter === "전체" ? visibleOrders : visibleOrders.filter((o) => o.status === filter);

  return (
    <div>
      <h1 className="mt-3 text-[24px] font-extrabold tracking-[-0.02em]">
        {role === "manager" ? "작업" : "내 작업"}
      </h1>
      <p className="mt-1 text-sm text-sub">
        {role === "manager" ? "빌딩 전체" : me.name} · {total}건 중{" "}
        <b className="text-ink">{doneCount}건</b> 완료
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-card">
        <div
          className="h-full rounded-full bg-brand transition-all duration-500"
          style={{ width: total ? `${(doneCount / total) * 100}%` : "0%" }}
        />
      </div>

      <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-bold transition-colors ${
              filter === f ? "bg-ink text-white" : "bg-card text-sub"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {shown.length === 0 && (
          <div className="rounded-[20px] bg-card px-4 py-10 text-center text-sm text-sub md:col-span-2">
            해당하는 작업이 없어요
          </div>
        )}

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

            <AssigneeRow order={o} />

            {/* 미배정 작업은 시작할 수 없다 — 배정이 선행 조건 */}
            {o.status === "대기" && role === "manager" && (
              <button
                onClick={() => openAssign(o.id)}
                className="mt-2.5 w-full rounded-xl bg-brand py-3 text-sm font-bold text-white transition-transform active:scale-[0.98]"
              >
                담당자 배정하기
              </button>
            )}
            {o.status === "배정됨" && (
              <button
                onClick={() => advance(o.id)}
                className="mt-2.5 w-full rounded-xl bg-brand-soft py-3 text-sm font-bold text-brand transition-transform active:scale-[0.98]"
              >
                시작
              </button>
            )}
            {o.status === "진행중" && (
              <button
                onClick={() => advance(o.id)}
                className="mt-2.5 w-full rounded-xl bg-brand-soft py-3 text-sm font-bold text-brand transition-transform active:scale-[0.98]"
              >
                완료 처리
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
