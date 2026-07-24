import Link from "next/link";
import { BUILDING, FEED } from "@/lib/mock";
import {
  AlertIcon,
  CalendarCheckIcon,
  ChevronIcon,
  MessageIcon,
  WrenchIcon,
} from "@/components/icons";

const KIND_STYLE: Record<
  string,
  {
    Icon: (p: { className?: string; strokeWidth?: number }) => React.ReactNode;
    tile: string;
  }
> = {
  alarm: { Icon: AlertIcon, tile: "bg-elev text-danger" },
  voc: { Icon: MessageIcon, tile: "bg-brand-soft text-brand" },
  work: { Icon: WrenchIcon, tile: "bg-tint-amber text-tint-amber-fg" },
  inspection: {
    Icon: CalendarCheckIcon,
    tile: "bg-tint-emerald text-tint-emerald-fg",
  },
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
          const urgent = f.kind === "alarm";
          return (
            <div
              key={f.id}
              className={`rise rounded-[20px] p-4 ${
                urgent ? "bg-danger-soft" : "bg-card"
              }`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.tile}`}
                >
                  <s.Icon className="h-5 w-5" strokeWidth={2.2} />
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
              {/* 위계: 긴급 1건만 강한 CTA, 나머지는 소프트 버튼 */}
              <div className="mt-3.5 flex items-center gap-2">
                <Link
                  href={f.href}
                  className={`flex flex-1 items-center justify-center gap-0.5 rounded-xl py-3 text-sm font-bold transition-transform active:scale-[0.98] ${
                    urgent
                      ? "bg-danger text-white"
                      : "bg-brand-soft text-brand"
                  }`}
                >
                  {f.cta}
                  <ChevronIcon className="h-4 w-4 opacity-60" strokeWidth={2.6} />
                </Link>
                {!urgent && (
                  <button className="rounded-xl px-4 py-3 text-sm font-semibold text-sub transition-transform active:scale-[0.98]">
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
