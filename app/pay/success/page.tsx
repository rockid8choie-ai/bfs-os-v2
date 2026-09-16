"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { PLANS, won, type PlanKey } from "@/lib/plans";

type Confirmed = {
  plan: PlanKey;
  amount?: number;
  receiptUrl?: string | null;
  alreadyPaid?: boolean;
};

function SuccessInner() {
  const search = useSearchParams();
  const [state, setState] = useState<"confirming" | "done" | "error">("confirming");
  const [result, setResult] = useState<Confirmed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const paymentKey = search.get("paymentKey");
    const orderId = search.get("orderId");
    const amount = Number(search.get("amount"));

    if (!paymentKey || !orderId || !Number.isFinite(amount)) {
      setState("error");
      setError("결제 정보가 올바르지 않습니다.");
      return;
    }

    api
      .post<Confirmed>("/api/billing/confirm", { paymentKey, orderId, amount })
      .then((r) => {
        setResult(r);
        setState("done");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "결제 승인에 실패했습니다.");
        setState("error");
      });
  }, [search]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center bg-page px-6 text-center">
      {state === "confirming" && (
        <>
          <div className="text-[40px]">·····</div>
          <h1 className="mt-3 text-[20px] font-extrabold">결제를 확인하고 있어요</h1>
          <p className="mt-2 text-[14px] text-sub">잠시만 기다려 주세요.</p>
        </>
      )}

      {state === "done" && result && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-[28px] font-extrabold text-brand">
            ✓
          </div>
          <h1 className="mt-4 text-[22px] font-extrabold tracking-[-0.02em]">
            {PLANS[result.plan].label} 플랜 시작!
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-sub">
            {result.amount ? `${won(result.amount)}원 결제가 완료됐습니다.` : "결제가 완료됐습니다."}
            <br />
            지금부터 바로 적용됩니다.
          </p>
          {result.receiptUrl && (
            <a
              href={result.receiptUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 rounded-full bg-card px-4 py-2 text-[13px] font-bold text-ink2"
            >
              영수증 보기
            </a>
          )}
          <Link
            href="/"
            className="mt-8 w-full rounded-2xl bg-brand py-4 text-[16px] font-bold text-white active:opacity-80"
          >
            홈으로
          </Link>
        </>
      )}

      {state === "error" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft text-[24px] font-extrabold text-danger">
            !
          </div>
          <h1 className="mt-4 text-[20px] font-extrabold">결제 승인에 실패했어요</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-sub">{error}</p>
          <p className="mt-1 text-[12px] text-sub">카드 승인 전이라면 청구되지 않습니다.</p>
          <Link
            href="/pricing"
            className="mt-8 w-full rounded-2xl bg-brand py-4 text-[16px] font-bold text-white active:opacity-80"
          >
            요금 페이지로
          </Link>
        </>
      )}
    </div>
  );
}

export default function PaySuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-sm text-sub">
          불러오는 중…
        </div>
      }
    >
      <SuccessInner />
    </Suspense>
  );
}
