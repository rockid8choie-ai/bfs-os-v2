"use client";

import Link from "next/link";
import { CardIcon, ChevronIcon } from "@/components/icons";
import { useIsNativeApp } from "@/lib/native";

// 스토어 배포 앱에서는 요금·결제 진입점을 노출하지 않는다.
export default function PricingLink() {
  const native = useIsNativeApp();
  if (native) return null;

  return (
    <Link
      href="/pricing"
      className="flex items-center gap-3 border-t border-page px-4 py-3.5 active:bg-line"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <CardIcon className="h-5 w-5" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold">요금</div>
        <div className="mt-0.5 text-xs text-sub">빌딩당 월 요금, 전부 공개</div>
      </div>
      <ChevronIcon className="h-4 w-4 text-mute" strokeWidth={2.4} />
    </Link>
  );
}
