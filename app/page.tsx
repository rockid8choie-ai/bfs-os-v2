import Link from "next/link";
import { BUILDING, FEED } from "@/lib/mock";

const KIND_STYLE: Record<string, { icon: string; tile: string }> = {
  alarm: { icon: "🚨", tile: "bg-danger-soft" },
  voc: { icon: "💬", tile: "bg-brand-soft" },
  work: { icon: "🔧", tile: "bg-amber-50" },
  inspection: { icon: "🗓️", tile: "bg-emerald-50" },
};

function Sparkline({ data }: { data: readonly number[] }) {
  const max = Math.max(...data);
  return (
    <svg viewBox={`0 0 ${data.length * 10 - 4} 32`} className="h-8 w-20">
      {data.map((v, i) => {
        const h = Math.max(4, (v / max) * 32);
        const last = i === data.length - 1;
        return (
          <rect
            key={i}
            x={i * 10}
            y={32 - h}
            width="6"
            height={h}
            rx="3"
            fill={last ? "#3182f6" : "rgba(255,255,255,0.22)"}
          />
        );
      })}
    </svg>
  );
}

export default function Home() {
  return (
    <div>
      <p className="mt-3 text-[13px] font-semibold text-sub">
        {BUILDING.todayLabel} · {BUILDING.name}
      </p>
      <h1 className="mt-1 text-[24px] font-extrabold leading-snug tracking-[-0.02em]">
        좋은 아침입니다, 소장님
      </h1>
      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-full bg-brand-soft px-3 py-1.5 text-[12px] font-bold text-brand">
          오늘 할 일 {BUILDING.todayCount}건
        </span>
        <span className="rounded-full bg-card px-3 py-1.5 text-[12px] font-bold text-ink2">
          이번 주 처리율 {BUILDING.weeklyRate}%
        </span>
      </div>

      <div className="mt-7 flex items-baseline justify-between px-1">
        <h2 className="text-[15px] font-bold">지금 처리할 일</h2>
        <span className="text-xs font-semibold text-sub">
          중요한 순서로 정렬됨
        </span>
      </div>

      <div className="mt-3 space-y-3">
        {FEED.map((f, i) => {
          const s = KIND_STYLE[f.kind];
          return (
            <div
              key={f.id}
              className={`rise rounded-[20px] p-4 ${
                f.kind === "alarm" ? "bg-danger-soft" : "bg-card"
              }`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${
                    f.kind === "alarm" ? "bg-white" : s.tile
                  }`}
                >
                  {s.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold leading-snug">{f.title}</div>
                  <div className="mt-0.5 text-[13px] text-sub">
                    {f.detail}
                    {f.priority && (
                      <span className="ml-1.5 font-bold text-danger">
                        · {f.priority}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3.5 flex items-center gap-2">
                <Link
                  href={f.href}
                  className={`flex-1 rounded-xl py-3 text-center text-sm font-bold text-white transition-transform active:scale-[0.98] ${
                    f.kind === "alarm" ? "bg-danger" : "bg-brand"
                  }`}
                >
                  {f.cta} <span className="opacity-70">›</span>
                </Link>
                {f.kind !== "alarm" && (
                  <button className="rounded-xl bg-line px-4 py-3 text-sm font-semibold text-ink2 transition-transform active:scale-[0.98]">
                    나중에
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="rise mt-5 flex items-center justify-between rounded-[20px] bg-gradient-to-br from-[#191f28] to-[#2c3542] px-5 py-4 text-white"
        style={{ animationDelay: `${FEED.length * 70}ms` }}
      >
        <div>
          <div className="text-[12px] font-semibold text-white/55">
            이번 주 BFS가 아낀 시간
          </div>
          <div className="mt-0.5 text-[22px] font-extrabold tracking-tight">
            {BUILDING.savedHoursWeek}시간
          </div>
          <div className="mt-0.5 text-[11px] text-white/45">
            AI 민원 분류 · 자동 배정 · 리포트 자동화
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Sparkline data={BUILDING.savedTrend} />
          <span className="text-[10px] font-semibold text-white/45">
            최근 8주
          </span>
        </div>
      </div>

      <p className="mt-7 text-center text-xs text-sub">
        오늘 할 일은 여기까지예요. 나머지는 BFS가 지켜보고 있을게요.
      </p>
    </div>
  );
}
