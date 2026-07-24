"use client";

import { useState } from "react";
import { VOCS } from "@/lib/mock";

const BADGE: Record<string, string> = {
  접수: "bg-amber-50 text-amber-700",
  처리중: "bg-blue-50 text-brand",
  완료: "bg-emerald-50 text-emerald-700",
};

export default function VocPage() {
  const [vocs, setVocs] = useState(VOCS);

  const toWork = (id: string) =>
    setVocs((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "처리중" as const } : v))
    );

  return (
    <div>
      <h1 className="mt-2 text-xl font-bold">민원</h1>
      <p className="mt-1 text-sm text-sub">
        새 민원 <b className="text-ink">{vocs.filter((v) => v.status === "접수").length}건</b>{" "}
        — AI가 유형을 미리 분류해뒀어요
      </p>

      <div className="mt-4 space-y-3">
        {vocs.map((v) => (
          <div key={v.id} className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-semibold leading-snug">“{v.title}”</div>
                <div className="mt-0.5 text-xs text-sub">
                  {v.tenant} · {v.createdAt} ·{" "}
                  <span className="font-semibold text-brand">AI: {v.aiTag}</span>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${BADGE[v.status]}`}
              >
                {v.status}
              </span>
            </div>
            {v.status === "접수" && (
              <button
                onClick={() => toWork(v.id)}
                className="mt-3 w-full rounded-lg bg-brand py-2.5 text-sm font-bold text-white"
              >
                작업 지시로 전환
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
