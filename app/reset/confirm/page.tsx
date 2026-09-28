"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Logo from "@/components/Logo";
import { api } from "@/lib/api";

function ResetConfirmForm() {
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.post("/api/auth/reset-confirm", { token, newPassword: password });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "변경에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  if (!token) {
    router.replace("/reset");
    return null;
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-page px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(20px,env(safe-area-inset-top))]">
      <Link href="/login" className="inline-flex w-fit" aria-label="로그인으로">
        <Logo />
      </Link>

      <h1 className="mt-8 text-[28px] font-extrabold tracking-[-0.03em]">
        새 비밀번호 만들기
      </h1>

      {done ? (
        <div className="mt-7">
          <div className="rounded-[20px] bg-brand-soft p-5">
            <div className="text-[15px] font-bold text-brand">변경 완료!</div>
            <p className="mt-1.5 text-[13px] text-ink2">
              새 비밀번호로 로그인해 주세요.
            </p>
          </div>
          <Link
            href="/login"
            className="mt-4 block w-full rounded-2xl bg-brand py-4 text-center text-[16px] font-bold text-white active:opacity-80"
          >
            로그인하러 가기
          </Link>
        </div>
      ) : (
        <form onSubmit={(e) => void submit(e)} className="mt-7 space-y-3">
          <label className="block">
            <span className="px-1 text-[12px] font-bold text-sub">
              새 비밀번호 (8자 이상)
            </span>
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {busy ? "변경 중…" : "비밀번호 변경"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-sm text-sub">
          불러오는 중…
        </div>
      }
    >
      <ResetConfirmForm />
    </Suspense>
  );
}
