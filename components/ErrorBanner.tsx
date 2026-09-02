"use client";

import { useApp } from "@/lib/store";

export default function ErrorBanner() {
  const { error, clearError } = useApp();
  if (!error) return null;

  return (
    <div className="mx-4 mt-3 flex items-start gap-3 rounded-2xl bg-danger-soft px-4 py-3 text-[13px] font-semibold text-danger md:mx-auto md:max-w-4xl md:px-0">
      <p className="min-w-0 flex-1">{error}</p>
      <button
        onClick={clearError}
        className="shrink-0 text-[12px] font-bold underline-offset-2 hover:underline"
      >
        닫기
      </button>
    </div>
  );
}
