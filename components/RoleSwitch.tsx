"use client";

import Avatar from "@/components/Avatar";
import { UsersIcon } from "@/components/icons";
import { useApp } from "@/lib/store";

/**
 * 베타 역할 전환 — 인증 도입 전까지 로그인을 대신한다.
 * 배정은 "주는 사람"과 "받는 사람"이 모두 있어야 성립하므로,
 * 한 기기에서 양쪽을 오가며 확인할 수 있어야 한다.
 */
export default function RoleSwitch() {
  const { role, setRole, me, techs } = useApp();
  const tech = techs[0];

  return (
    <section className="rise mt-7" style={{ animationDelay: "300ms" }}>
      <h2 className="px-1 text-[13px] font-bold text-sub">역할 전환 (베타)</h2>
      <div className="mt-2.5 rounded-[20px] bg-card p-4">
        <div className="flex items-center gap-3">
          <Avatar member={me} size={40} />
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-bold">{me.name}</div>
            <div className="mt-0.5 text-xs text-sub">{me.title}로 보는 중</div>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-page text-sub">
            <UsersIcon className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
        </div>

        <div className="mt-3.5 flex gap-1.5 rounded-xl bg-page p-1">
          <button
            onClick={() => setRole("manager")}
            className={`flex-1 rounded-lg py-2.5 text-[13px] font-bold transition-colors ${
              role === "manager" ? "bg-ink text-white" : "text-sub"
            }`}
          >
            관리소장
          </button>
          <button
            onClick={() => setRole("tech")}
            className={`flex-1 rounded-lg py-2.5 text-[13px] font-bold transition-colors ${
              role === "tech" ? "bg-ink text-white" : "text-sub"
            }`}
          >
            시설팀 {tech.name}
          </button>
        </div>

        <p className="mt-3 text-[11.5px] leading-relaxed text-sub">
          소장은 접수를 <b className="font-bold text-ink2">배정</b>하고, 시설팀은 배정받은
          작업만 보고 <b className="font-bold text-ink2">처리</b>합니다. 정식 버전에서는 로그인
          계정으로 자동 구분됩니다.
        </p>
      </div>
    </section>
  );
}
