"use client";

import Avatar from "@/components/Avatar";
import { WrenchIcon } from "@/components/icons";
import { useApp } from "@/lib/store";

const BADGE: Record<string, string> = {
  접수: "bg-tint-amber text-tint-amber-fg",
  처리중: "bg-brand-soft text-brand",
  완료: "bg-tint-emerald text-tint-emerald-fg",
};

export default function VocPage() {
  const { vocs, orders, convertVoc, openAssign, openMember, memberById, role } = useApp();

  // 전환 = 실제 작업지시 생성 + 배정 시트 즉시 호출 (상태만 바꾸던 v2의 반쪽 동작을 대체)
  const toWork = async (vocId: string) => {
    const orderId = await convertVoc(vocId);
    openAssign(orderId);
  };

  return (
    <div>
      <h1 className="mt-3 text-[24px] font-extrabold tracking-[-0.02em]">민원</h1>
      <p className="mt-1 text-sm text-sub">
        새 민원{" "}
        <b className="text-ink">{vocs.filter((v) => v.status === "접수").length}건</b> — AI가
        유형을 미리 분류해뒀어요
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {vocs.map((v, i) => {
          const linked = orders.find((o) => o.vocId === v.id);
          const assignee = memberById(linked?.assigneeId);
          return (
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

              {/* 민원 ↔ 작업 연결을 화면에서 끊기지 않게 유지 */}
              {linked && (
                <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-elev px-3 py-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tint-amber text-tint-amber-fg">
                    <WrenchIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-bold">
                      {linked.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-sub">
                      작업지시 · {linked.status}
                      {!assignee && " · 담당 미지정"}
                    </span>
                  </span>
                  {assignee ? (
                    <button
                      onClick={() => openMember(assignee.id, linked.id)}
                      aria-label={`${assignee.name} 프로필`}
                      className="shrink-0 transition-transform active:scale-95"
                    >
                      <Avatar member={assignee} size={26} />
                    </button>
                  ) : (
                    role === "manager" && (
                      <button
                        onClick={() => openAssign(linked.id)}
                        className="shrink-0 rounded-lg bg-danger px-2.5 py-1.5 text-[11px] font-bold text-white"
                      >
                        담당 지정
                      </button>
                    )
                  )}
                </div>
              )}

              {v.status === "접수" && !linked && role === "manager" && (
                <button
                  onClick={() => void toWork(v.id)}
                  className="mt-3.5 w-full rounded-xl bg-brand-soft py-3 text-sm font-bold text-brand transition-transform active:scale-[0.98]"
                >
                  작업 지시로 전환
                </button>
              )}
              {v.status === "접수" && linked && role === "manager" && (
                <button
                  onClick={() => openAssign(linked.id)}
                  className="mt-3.5 w-full rounded-xl bg-brand-soft py-3 text-sm font-bold text-brand transition-transform active:scale-[0.98]"
                >
                  담당자 지정하고 처리 시작
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
