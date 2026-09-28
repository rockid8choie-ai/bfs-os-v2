"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";
import { api } from "@/lib/api";

export default function ResetRequestPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.post("/api/auth/reset-request", { email });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "요청에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-page px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(20px,env(safe-area-inset-top))]">
      <Link href="/login" className="inline-flex w-fit" aria-label="로그인으로">
        <Logo />
      </Link>

      <h1 className="mt-8 text-[28px] font-extrabold tracking-[-0.03em]">
        비밀번호 재설정
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-sub">
        가입한 이메일을 알려주시면
        <br />
        재설정 링크를 보내드립니다.
      </p>

      {sent ? (
        <div className="mt-7 rounded-[20px] bg-brand-soft p-5">
          <div className="text-[15px] font-bold text-brand">메일을 확인해 주세요</div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink2">
            {email} 로 재설정 링크를 보냈습니다. 30분 안에 링크를 눌러 새 비밀번호를
            만들어 주세요. 메일이 안 보이면 스팸함도 확인해 주세요.
          </p>
        </div>
      ) : (
        <form onSubmit={(e) => void submit(e)} className="mt-7 space-y-3">
          <label className="block">
            <span className="px-1 text-[12px] font-bold text-sub">이메일</span>
            <input
              type="email"
              inputMode="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="mt-1.5 w-full rounded-2xl border border-line bg-card px-4 py-3.5 text-[16px] outline-none focus:border-brand"
            />
          </label>

          {error && (
            <p className="rounded-2xl bg-danger-soft px-4 py-3 text-[13px] font-semibold text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-brand py-4 text-[16px] font-bold text-white transition-transform active:scale-[0.98] disabled:opacity-40"
          >
            {busy ? "보내는 중…" : "재설정 링크 보내기"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-[13px] text-sub">
        <Link href="/login" className="font-bold text-brand">
          로그인으로 돌아가기
        </Link>
      </p>
    </div>
  );
}
