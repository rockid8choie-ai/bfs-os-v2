"use client";

import Avatar from "@/components/Avatar";
import { CheckIcon, SparkIcon } from "@/components/icons";
import { useApp } from "@/lib/store";

/**
 * S-06 담당자 배정 시트 — v2.1의 유일한 신규 화면.
 * 접수 완료 · 홈 피드 · 민원 전환 · 작업 카드 네 곳에서 같은 시트를 재사용한다.
 */
export default function AssignSheet() {
  const {
    assignTarget,
    closeAssign,
    orders,
    techs,
    me,
    memberById,
    loadOf,
    doneTodayOf,
    recommendFor,
    assign,
  } = useApp();

  const order = orders.find((o) => o.id === assignTarget);
  if (!order) return null;

  const rec = recommendFor(order);
  const current = memberById(order.assigneeId);
  const rest = techs.filter((m) => m.id !== rec?.member.id);

  const pick = (memberId: string) => {
    assign(order.id, memberId);
    closeAssign();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center overflow-hidden bg-black/50 md:absolute md:rounded-[38px]"
      onClick={closeAssign}
    >
      <div
        className="sheet-up max-h-[88%] w-full max-w-md overflow-y-auto rounded-t-3xl bg-page p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold">
          {current ? "담당자를 바꿀까요?" : "누가 처리할까요?"}
        </h2>
        <p className="mt-1 line-clamp-1 text-sm text-sub">
          {order.title} · {order.location}
        </p>

        {rec && (
          <>
            <div className="mt-4 flex items-center gap-1.5 px-1 text-[12px] font-bold text-brand">
              <SparkIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
              AI 추천
            </div>
            <button
              onClick={() => pick(rec.member.id)}
              className="mt-1.5 flex w-full items-center gap-3 rounded-2xl bg-brand-soft p-3.5 text-left transition-transform active:scale-[0.98]"
            >
              <Avatar member={rec.member} size={44} />
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold">
                  {rec.member.name}
                  <span className="ml-1.5 text-[12px] font-medium text-sub">
                    {rec.member.title}
                  </span>
                </span>
                <span className="mt-0.5 block text-[12px] font-semibold text-brand">
                  {rec.reason}
                </span>
              </span>
              <span className="shrink-0 rounded-lg bg-brand px-3 py-2 text-[13px] font-bold text-white">
                배정
              </span>
            </button>
          </>
        )}

        <div className="mt-5 px-1 text-[12px] font-bold text-sub">시설팀</div>
        <div className="mt-1.5 overflow-hidden rounded-2xl bg-card">
          {rest.map((m, i) => {
            const load = loadOf(m.id);
            const busy = load >= 3;
            return (
              <button
                key={m.id}
                onClick={() => pick(m.id)}
                className={`flex w-full items-center gap-3 px-3.5 py-3 text-left active:bg-line ${
                  i > 0 ? "border-t border-page" : ""
                } ${busy ? "opacity-45" : ""}`}
              >
                <Avatar member={m} size={36} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-bold">
                    {m.name}
                    {m.id === current?.id && (
                      <span className="ml-1.5 text-[11px] font-bold text-brand">현재 담당</span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] text-sub">
                    {m.specialty.join(" · ")}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span
                    className={`block text-[12px] font-bold ${busy ? "text-danger" : "text-ink2"}`}
                  >
                    진행중 {load}건
                  </span>
                  <span className="block text-[11px] text-sub">
                    오늘 완료 {doneTodayOf(m.id)}건
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => pick(me.id)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-card py-3 text-sm font-bold text-ink2 transition-transform active:scale-[0.98]"
        >
          <CheckIcon className="h-4 w-4" strokeWidth={2.4} />
          내가 직접 처리
        </button>

        <button
          onClick={closeAssign}
          className="mt-2 w-full py-3 text-sm font-semibold text-sub"
        >
          {current ? "닫기" : "나중에 지정 (대기로 남김)"}
        </button>
      </div>
    </div>
  );
}
