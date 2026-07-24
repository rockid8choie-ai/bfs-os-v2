import Link from "next/link";
import { BUILDING, FEED } from "@/lib/mock";

const KIND_ICON: Record<string, string> = {
  alarm: "🚨",
  voc: "💬",
  work: "🔧",
  inspection: "🗓️",
};

export default function Home() {
  return (
    <div>
      <h1 className="mt-2 text-xl font-bold">좋은 아침입니다, 소장님</h1>
      <p className="mt-1 text-sm text-sub">
        {BUILDING.name} · 오늘 처리할 일{" "}
        <b className="text-ink">{BUILDING.todayCount}건</b> · 이번 주 처리율{" "}
        {BUILDING.weeklyRate}%
      </p>

      <div className="mt-4 space-y-3">
        {FEED.map((f) => (
          <div
            key={f.id}
            className={`rounded-2xl bg-card p-4 shadow-sm ${
              f.kind === "alarm" ? "border-l-4 border-danger" : ""
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">{KIND_ICON[f.kind]}</span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold leading-snug">{f.title}</div>
                <div className="mt-0.5 text-xs text-sub">
                  {f.detail}
                  {f.priority && (
                    <span className="ml-1.5 font-bold text-danger">
                      · {f.priority}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Link
                href={f.href}
                className={`rounded-lg px-4 py-2 text-sm font-bold text-white ${
                  f.kind === "alarm" ? "bg-danger" : "bg-brand"
                }`}
              >
                {f.cta}
              </Link>
              {f.kind !== "alarm" && (
                <button className="px-2 py-2 text-sm text-sub">나중에</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-brand-deep px-4 py-3.5 text-white">
        <div>
          <div className="text-[11px] text-slate-300">이번 주 BFS가 아낀 시간</div>
          <div className="text-lg font-extrabold">
            {BUILDING.savedHoursWeek}시간
          </div>
        </div>
        <div className="text-right text-[11px] leading-relaxed text-slate-300">
          AI 민원 분류 · 자동 배정
          <br />
          리포트 자동 작성
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-sub">
        오늘 할 일은 여기까지예요. 나머지는 BFS가 지켜보고 있을게요.
      </p>
    </div>
  );
}
