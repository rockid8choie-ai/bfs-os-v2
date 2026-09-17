/* 로고는 승인 원본 워드마크만 사용한다(글자 재현 금지).
   다크모드는 .logo-knockout(흰색 녹아웃) — v1 승인 방식. */
export default function Logo({
  compact = false,
  invert = false,
}: {
  compact?: boolean;
  invert?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/bfs-wordmark.svg"
        alt="BFS"
        className={`logo-knockout w-auto ${compact ? "h-[18px]" : "h-[22px]"} ${
          invert ? "brightness-0 invert" : ""
        }`}
      />
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ${
          invert ? "bg-white/15 text-white" : "bg-brand-soft text-brand"
        }`}
      >
        OS
      </span>
    </span>
  );
}
