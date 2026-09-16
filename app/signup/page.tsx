"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import { useApp } from "@/lib/store";

export default function SignupPage() {
  const { signup, authenticated, ready } = useApp();
  const router = useRouter();

  const [buildingName, setBuildingName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (ready && authenticated) {
    router.replace("/");
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signup({ buildingName, name, email, password, phone });
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "가입에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "mt-1.5 w-full rounded-2xl border border-line bg-card px-4 py-3.5 text-[16px] outline-none focus:border-brand";

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-page px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(20px,env(safe-area-inset-top))]">
      <Link href="/landing" className="inline-flex w-fit" aria-label="BFS OS 소개">
        <Logo />
      </Link>

      <h1 className="mt-8 text-[28px] font-extrabold tracking-[-0.03em]">
        우리 빌딩 시작하기
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-sub">
        관리소장 계정과 빌딩이 함께 만들어집니다.
        <br />
        팀원은 가입 후 메뉴에서 등록할 수 있어요.
      </p>

      <form onSubmit={(e) => void submit(e)} className="mt-7 space-y-3">
        <label className="block">
          <span className="px-1 text-[12px] font-bold text-sub">빌딩 이름</span>
          <input
            value={buildingName}
            onChange={(e) => setBuildingName(e.target.value)}
            placeholder="예) 역삼타워"
            required
            className={field}
          />
        </label>
        <label className="block">
          <span className="px-1 text-[12px] font-bold text-sub">이름</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            className={field}
          />
        </label>
        <label className="block">
          <span className="px-1 text-[12px] font-bold text-sub">이메일</span>
          <input
            type="email"
            inputMode="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={field}
          />
        </label>
        <label className="block">
          <span className="px-1 text-[12px] font-bold text-sub">비밀번호 (8자 이상)</span>
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={field}
          />
        </label>
        <label className="block">
          <span className="px-1 text-[12px] font-bold text-sub">연락처 (선택)</span>
          <input
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            className={field}
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
          {busy ? "만드는 중…" : "무료로 시작하기"}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-sub">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-bold text-brand">
          로그인
        </Link>
      </p>
    </div>
  );
}
