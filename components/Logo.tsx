export default function Logo({
  compact = false,
  invert = false,
}: {
  compact?: boolean;
  invert?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`flex items-center justify-center rounded-lg text-[11px] font-black ${
          invert ? "bg-white text-[#191f28]" : "bg-brand text-white"
        } ${compact ? "h-6 w-6" : "h-7 w-7"}`}
      >
        B
      </span>
      <span
        className={`font-extrabold tracking-tight ${
          invert ? "text-white" : "text-ink"
        } ${compact ? "text-[15px]" : "text-[17px]"}`}
      >
        BFS
      </span>
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
