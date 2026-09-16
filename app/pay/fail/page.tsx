"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FailInner() {
  const search = useSearchParams();
  const message = search.get("message") ?? "결제가 취소되었거나 실패했습니다.";

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center bg-page px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft text-[24px] font-extrabold text-danger">
        !
      </div>
      <h1 className="mt-4 text-[20px] font-extrabold">결제하지 못했어요</h1>
      <p className="mt-2 text-[14px] leading-relaxed text-sub">{message}</p>
      <p className="mt-1 text-[12px] text-sub">카드에는 청구되지 않았습니다.</p>
      <Link
        href="/pricing"
        className="mt-8 w-full rounded-2xl bg-brand py-4 text-[16px] font-bold text-white active:opacity-80"
      >
        다시 시도하기
      </Link>
    </div>
  );
}

export default function PayFailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-sm text-sub">
          불러오는 중…
        </div>
      }
    >
      <FailInner />
    </Suspense>
  );
}
