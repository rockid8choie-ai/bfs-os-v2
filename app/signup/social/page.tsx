"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Logo from "@/components/Logo";
import { api } from "@/lib/api";

function SocialSignupForm() {
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get("token") ?? "";

  const [buildingName, setBuildingName] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const field =
    "mt-1.5 w-full rounded-2xl border border-line bg-card px-4 py-3.5 text-[16px] outline-none focus:border-brand";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.post("/api/auth/social-signup", {
        token,
        buildingName,
        ...(name.trim() ? { name: name.trim() } : {}),
      });
      // 전체 리로드로 스토어를 새 세션으로 부트스트랩한다.
      window.location.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "가입에 실패했습니다.");
      setBusy(false);
    }
  };

  if (!token) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-page px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(20px,env(safe-area-inset-top))]">
      <Link href="/landing" className="inline-flex w-fit" aria-label="BFS OS 소개">
        <Logo />
      </Link>

      <h1 className="mt-8 text-[28px] font-extrabold tracking-[-0.03em]">
        거의 다 됐어요
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-sub">
        소셜 로그인 확인이 끝났습니다.
        <br />
        운영할 빌딩 이름만 알려주시면 바로 시작합니다.
      </p>

      <form onSubmit={(e) => void submit(e)} className="mt-7 space-y-3">
        <label className="block">
          <span className="px-1 text-[12px] font-bold text-sub">빌딩 이름</span>
          <input
            value={buildingName}
            onChange={(e) => setBuildingName(e.target.value)}
            placeholder="예) 역삼타워"
            required
            autoFocus
            className={field}
          />
        </label>
        <label className="block">
          <span className="px-1 text-[12px] font-bold text-sub">
            이름 (선택 — 소셜 프로필 이름을 그대로 쓰려면 비워두세요)
          </span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={field} />
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
        <Link href="/login" className="font-bold text-brand">
          처음부터 다시
        </Link>
      </p>
    </div>
  );
}

export default function SocialSignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-sm text-sub">
          불러오는 중…
        </div>
      }
    >
      <SocialSignupForm />
    </Suspense>
  );
}
