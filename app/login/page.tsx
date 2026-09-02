"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { DEMO_ACCOUNTS } from "@/lib/demo-accounts";
import { useApp } from "@/lib/store";

function LoginForm() {
  const { login, authenticated, ready } = useApp();
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/";

  const [email, setEmail] = useState<string>(DEMO_ACCOUNTS[0].email);
  const [password, setPassword] = useState<string>(DEMO_ACCOUNTS[0].password);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (ready && authenticated) {
    router.replace(next.startsWith("/") ? next : "/");
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      router.replace(next.startsWith("/") ? next : "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto min-h-dvh max-w-md px-5 py-10">
      <Link href="/landing" className="inline-flex items-center gap-2">
        <Image
          src="/bfs-wordmark.png"
          alt="BFS"
          width={72}
          height={22}
          className="logo-knockout h-[20px] w-auto"
          priority
        />
        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand">
          OS
        </span>
      </Link>

      <h1 className="mt-8 text-[26px] font-extrabold tracking-[-0.03em]">로그인</h1>
      <p className="mt-2 text-sm leading-relaxed text-sub">
        건물 계정으로 들어와 작업과 민원을 이어서 봅니다. 데모는 아래 계정으로 바로 시작할 수 있습니다.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-3">
        <label className="block">
          <span className="px-1 text-[12px] font-bold text-sub">이메일</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-page px-3 py-3 text-[15px] outline-none focus:border-brand"
          />
        </label>
        <label className="block">
          <span className="px-1 text-[12px] font-bold text-sub">비밀번호</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-page px-3 py-3 text-[15px] outline-none focus:border-brand"
          />
        </label>

        {error && (
          <p className="rounded-xl bg-danger-soft px-3 py-2.5 text-[13px] font-semibold text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-brand py-3.5 text-[15px] font-bold text-white transition-transform active:scale-[0.98] disabled:opacity-40"
        >
          {busy ? "확인 중…" : "로그인"}
        </button>
      </form>

      <div className="mt-8">
        <p className="px-1 text-[12px] font-bold text-sub">데모 계정</p>
        <div className="mt-2 overflow-hidden rounded-2xl bg-card">
          {DEMO_ACCOUNTS.map((a, i) => (
            <button
              key={a.email}
              type="button"
              onClick={() => {
                setEmail(a.email);
                setPassword(a.password);
              }}
              className={`flex w-full items-center justify-between px-4 py-3 text-left active:bg-line ${
                i > 0 ? "border-t border-page" : ""
              }`}
            >
              <span>
                <span className="block text-[14px] font-bold">{a.label}</span>
                <span className="mt-0.5 block text-[12px] text-sub">{a.email}</span>
              </span>
              <span className="text-[12px] font-bold text-brand">채우기</span>
            </button>
          ))}
        </div>
        <p className="mt-2 px-1 text-[11px] text-sub">비밀번호는 모두 demo1234 입니다.</p>
      </div>

      <p className="mt-10 text-center text-[12px] text-sub">
        <Link href="/landing" className="font-semibold text-ink2">
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
