"use client";

import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import { useApp } from "@/lib/store";

export default function AccountPanel() {
  const { me, logout, loading } = useApp();
  const router = useRouter();
  if (!me) return null;

  return (
    <section className="rise mt-7" style={{ animationDelay: "300ms" }}>
      <h2 className="px-1 text-[13px] font-bold text-sub">계정</h2>
      <div className="mt-2.5 rounded-[20px] bg-card p-4">
        <div className="flex items-center gap-3">
          <Avatar member={me} size={40} />
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-bold">{me.name}</div>
            <div className="mt-0.5 text-xs text-sub">
              {me.title} · {me.email}
            </div>
          </div>
        </div>
        <p className="mt-3 text-[11.5px] leading-relaxed text-sub">
          {me.role === "manager"
            ? "건물 전체 작업과 민원을 보고 담당자를 배정합니다."
            : "배정받은 작업만 보고 시작·완료를 기록합니다."}
        </p>
        <button
          disabled={loading}
          onClick={async () => {
            await logout();
            router.replace("/login");
          }}
          className="mt-3.5 w-full rounded-xl bg-page py-3 text-[13px] font-bold text-ink2 transition-transform active:scale-[0.98] disabled:opacity-40"
        >
          로그아웃
        </button>
      </div>
    </section>
  );
}
