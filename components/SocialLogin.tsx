"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useIsNativeApp } from "@/lib/native";

type Provider = "kakao" | "google" | "naver";

const LABELS: Record<Provider, { label: string; className: string; mark: string }> = {
  kakao: {
    label: "카카오로 계속하기",
    className: "bg-[#FEE500] text-[#191919]",
    mark: "K",
  },
  naver: {
    label: "네이버로 계속하기",
    className: "bg-[#03C75A] text-white",
    mark: "N",
  },
  google: {
    label: "Google로 계속하기",
    className: "border border-line bg-card text-ink",
    mark: "G",
  },
};

// 소셜 로그인 버튼 — env에 키가 등록된 제공자만 서버가 내려준다.
// 네이티브 앱에서는 미노출(애플 4.8: 소셜 노출 시 Sign in with Apple 의무 → 셸에서는 이메일만).
export default function SocialLogin() {
  const native = useIsNativeApp();
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    api
      .get<{ providers: Provider[] }>("/api/auth/oauth/providers")
      .then((r) => setProviders(r.providers))
      .catch(() => setProviders([]));
  }, []);

  if (native || providers.length === 0) return null;

  return (
    <div className="mt-5">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[11px] font-bold text-sub">또는</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="mt-4 space-y-2.5">
        {providers.map((p) => (
          <a
            key={p}
            href={`/api/auth/oauth/${p}`}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-bold transition-transform active:scale-[0.98] ${LABELS[p].className}`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[11px] font-extrabold">
              {LABELS[p].mark}
            </span>
            {LABELS[p].label}
          </a>
        ))}
      </div>
    </div>
  );
}
