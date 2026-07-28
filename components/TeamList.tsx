"use client";

import Avatar from "@/components/Avatar";
import { ChevronIcon } from "@/components/icons";
import { useApp } from "@/lib/store";

/** 구성원 목록 — 여기서도 같은 프로필 시트로 들어간다 (진입점만 다르고 화면은 하나) */
export default function TeamList() {
  const { members, loadOf, doneTodayOf, openMember } = useApp();

  return (
    <section className="rise mt-7" style={{ animationDelay: "260ms" }}>
      <h2 className="px-1 text-[13px] font-bold text-sub">구성원</h2>
      <div className="mt-2.5 overflow-hidden rounded-[20px] bg-card">
        {members.map((m, i) => (
          <button
            key={m.id}
            onClick={() => openMember(m.id)}
            className={`flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-line ${
              i > 0 ? "border-t border-page" : ""
            }`}
          >
            <Avatar member={m} size={40} />
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold">{m.name}</div>
              <div className="mt-0.5 text-xs text-sub">
                {m.title} · {m.specialty.join(" · ")}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[12px] font-bold text-ink2">
                진행중 {loadOf(m.id)}건
              </div>
              <div className="text-[11px] text-sub">완료 {doneTodayOf(m.id)}건</div>
            </div>
            <ChevronIcon className="h-4 w-4 shrink-0 text-mute" strokeWidth={2.4} />
          </button>
        ))}
      </div>
    </section>
  );
}
