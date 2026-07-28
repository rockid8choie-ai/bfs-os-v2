"use client";

import Avatar from "@/components/Avatar";
import { PhoneIcon, SwapIcon } from "@/components/icons";
import { useApp } from "@/lib/store";
import type { WoStatus } from "@/lib/mock";

const BADGE: Record<WoStatus, string> = {
  대기: "bg-danger-soft text-danger",
  배정됨: "bg-tint-amber text-tint-amber-fg",
  진행중: "bg-brand-soft text-brand",
  완료: "bg-tint-emerald text-tint-emerald-fg",
};

/**
 * 담당자 프로필 시트.
 * 작업 카드의 담당자를 누르면 그 자리에서 열리고, "이 작업 담당자 변경"이 배정 시트로 바로 이어진다.
 * 프로필을 보러 다른 화면으로 나갔다가 돌아오는 왕복을 없애는 게 목적.
 */
export default function MemberSheet() {
  const {
    memberTarget,
    closeMember,
    memberById,
    ordersOf,
    doneTodayOf,
    openAssign,
    role,
  } = useApp();

  if (!memberTarget) return null;
  const member = memberById(memberTarget.memberId);
  if (!member) return null;

  const mine = ordersOf(member.id);
  const waiting = mine.filter((o) => o.status === "배정됨").length;
  const active = mine.filter((o) => o.status === "진행중").length;
  const done = doneTodayOf(member.id);

  const reassign = () => {
    const target = memberTarget.fromOrderId;
    closeMember();
    if (target) openAssign(target);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center overflow-hidden bg-black/50 md:absolute md:rounded-[38px]"
      onClick={closeMember}
    >
      <div
        className="sheet-up max-h-[88%] w-full max-w-md overflow-y-auto rounded-t-3xl bg-page p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3.5">
          <Avatar member={member} size={56} />
          <div className="min-w-0 flex-1">
            <div className="text-[19px] font-extrabold tracking-[-0.02em]">
              {member.name}
            </div>
            <div className="mt-0.5 text-[13px] text-sub">
              {member.title} · 경력 {member.years}년
            </div>
          </div>
          <a
            href={`tel:${member.phone.replace(/-/g, "")}`}
            aria-label={`${member.name}에게 전화`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand transition-transform active:scale-95"
          >
            <PhoneIcon className="h-5 w-5" strokeWidth={2} />
          </a>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {member.specialty.map((s) => (
            <span
              key={s}
              className="rounded-full bg-card px-3 py-1.5 text-[12px] font-bold text-ink2"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: "진행중", value: active, tone: "text-brand" },
            { label: "대기중", value: waiting, tone: "text-ink" },
            { label: "오늘 완료", value: done, tone: "text-tint-emerald-fg" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card px-3 py-3.5 text-center">
              <div className={`text-[22px] font-extrabold tracking-tight ${s.tone}`}>
                {s.value}
              </div>
              <div className="mt-0.5 text-[11.5px] font-semibold text-sub">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 px-1 text-[12px] font-bold text-sub">
          담당 작업 {mine.length}건
        </div>
        <div className="mt-1.5 overflow-hidden rounded-2xl bg-card">
          {mine.length === 0 && (
            <div className="px-4 py-6 text-center text-[13px] text-sub">
              지금 배정된 작업이 없어요
            </div>
          )}
          {mine.map((o, i) => (
            <div
              key={o.id}
              className={`flex items-center gap-2.5 px-3.5 py-3 ${
                i > 0 ? "border-t border-page" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-semibold">{o.title}</div>
                <div className="mt-0.5 text-[11.5px] text-sub">
                  {o.location} · 마감 {o.due}
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${BADGE[o.status]}`}
              >
                {o.status}
              </span>
            </div>
          ))}
        </div>

        {role === "manager" && memberTarget.fromOrderId && (
          <button
            onClick={reassign}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-soft py-3.5 text-sm font-bold text-brand transition-transform active:scale-[0.98]"
          >
            <SwapIcon className="h-4 w-4" strokeWidth={2.2} />
            이 작업, 다른 담당자에게
          </button>
        )}

        <button
          onClick={closeMember}
          className="mt-2 w-full py-3 text-sm font-semibold text-sub"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
