"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Logo from "@/components/Logo";
import SocialLogin from "@/components/SocialLogin";
import { useApp } from "@/lib/store";

function LoginForm() {
  const { login, authenticated, ready } = useApp();
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/";
  const dest = next.startsWith("/") ? next : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  // 소셜 콜백 실패는 ?error= 로 돌아온다.
  const [error, setError] = useState<string | null>(search.get("error"));

  if (ready && authenticated) {
    router.replace(dest);
  }

  const go = async (mail: string, pass: string) => {
    setBusy(true);
    setError(null);
    try {
      await login(mail, pass);
      router.replace(dest);
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-page px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(20px,env(safe-area-inset-top))]">
      <Link href="/landing" className="inline-flex w-fit" aria-label="BFS OS 소개">
        <Logo />
      </Link>

      <h1 className="mt-8 text-[28px] font-extrabold tracking-[-0.03em]">
        폰으로 건물 운영
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-sub">
        접수한 작업이 서버에 남고, 담당자 배정까지 이어서 됩니다.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void go(email, password);
        }}
        className="mt-7 space-y-3"
      >
        <label className="block">
          <span className="px-1 text-[12px] font-bold text-sub">이메일</span>
          <input
            type="email"
            inputMode="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-line bg-card px-4 py-3.5 text-[16px] outline-none focus:border-brand"
          />
        </label>
        <label className="block">
          <span className="px-1 text-[12px] font-bold text-sub">비밀번호</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {busy ? "확인 중…" : "로그인"}
        </button>
      </form>

      <p className="mt-4 text-center text-[13px] text-sub">
        처음이신가요?{" "}
        <Link href="/signup" className="font-bold text-brand">
          우리 빌딩 시작하기
        </Link>
        <span className="mx-2 text-line">|</span>
        <Link href="/reset" className="font-semibold text-ink2">
          비밀번호 찾기
        </Link>
      </p>

      <SocialLogin />


      <p className="mt-auto pt-10 text-center text-[13px] font-semibold text-sub">
        <Link href="/landing" className="text-ink2">
          서비스 소개
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-sm text-sub">
          불러오는 중…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
