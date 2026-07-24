"use client";

import { useState } from "react";
import { VOCS } from "@/lib/mock";

const BADGE: Record<string, string> = {
  접수: "bg-tint-amber text-tint-amber-fg",
  처리중: "bg-brand-soft text-brand",
  완료: "bg-tint-emerald text-tint-emerald-fg",
};

export default function VocPage() {
  const [vocs, setVocs] = useState(VOCS);

  const toWork = (id: string) =>
    setVocs((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "처리중" as const } : v))
    );

  return (
    <div>
      <h1 className="mt-3 text-[24px] font-extrabold tracking-[-0.02em]">민원</h1>
      <p className="mt-1 text-sm text-sub">
        새 민원{" "}
        <b className="text-ink">
          {vocs.filter((v) => v.status === "접수").length}건
        </b>{" "}
        — AI가 유형을 미리 분류해뒀어요
      </p>

      <div className="mt-5 space-y-3">
        {vocs.map((v, i) => (
          <div
            key={v.id}
            className="rise rounded-[20px] bg-card p-4"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-semibold leading-snug">“{v.title}”</div>
                <div className="mt-0.5 text-[13px] text-sub">
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
                className="mt-3.5 w-full rounded-xl bg-brand-soft py-3 text-sm font-bold text-brand transition-transform active:scale-[0.98]"
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
