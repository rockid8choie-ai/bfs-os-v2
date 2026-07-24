import Link from "next/link";
import { BUILDING, FEED } from "@/lib/mock";

const KIND_STYLE: Record<string, { icon: string; tile: string }> = {
  alarm: { icon: "🚨", tile: "bg-danger-soft" },
  voc: { icon: "💬", tile: "bg-brand-soft" },
  work: { icon: "🔧", tile: "bg-amber-50" },
  inspection: { icon: "🗓️", tile: "bg-emerald-50" },
};

export default function Home() {
  return (
    <div>
      <h1 className="mt-3 text-[22px] font-bold tracking-tight">
        좋은 아침입니다, 소장님
      </h1>
      <p className="mt-1 text-sm text-sub">
        {BUILDING.name} · 오늘 처리할 일{" "}
        <b className="text-ink">{BUILDING.todayCount}건</b> · 이번 주 처리율{" "}
        {BUILDING.weeklyRate}%
      </p>

      <div className="mt-5 space-y-3">
        {FEED.map((f) => {
          const s = KIND_STYLE[f.kind];
          return (
            <div
              key={f.id}
              className={`rounded-[20px] p-4 ${
                f.kind === "alarm" ? "bg-danger-soft" : "bg-card"
              }`}
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
                  className={`flex-1 rounded-xl py-3 text-center text-sm font-bold text-white active:opacity-80 ${
                    f.kind === "alarm" ? "bg-danger" : "bg-brand"
                  }`}
                >
                  {f.cta}
                </Link>
                {f.kind !== "alarm" && (
                  <button className="rounded-xl bg-line px-4 py-3 text-sm font-semibold text-ink2 active:opacity-80">
                    나중에
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-[20px] bg-brand-deep px-5 py-4 text-white">
        <div>
          <div className="text-[12px] text-white/60">이번 주 BFS가 아낀 시간</div>
          <div className="mt-0.5 text-xl font-extrabold tracking-tight">
            {BUILDING.savedHoursWeek}시간
          </div>
        </div>
        <div className="text-right text-[11px] leading-relaxed text-white/60">
          AI 민원 분류 · 자동 배정
          <br />
          리포트 자동 작성
        </div>
      </div>

      <p className="mt-7 text-center text-xs text-sub">
        오늘 할 일은 여기까지예요. 나머지는 BFS가 지켜보고 있을게요.
      </p>
    </div>
  );
}
