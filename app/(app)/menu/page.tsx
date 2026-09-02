import Link from "next/link";
import AccountPanel from "@/components/AccountPanel";
import TeamList from "@/components/TeamList";
import { MENU_GROUPS } from "@/lib/mock";
import {
  AlertIcon,
  BellIcon,
  BuildingIcon,
  CalendarCheckIcon,
  CardIcon,
  ChartIcon,
  ChevronIcon,
  FileTextIcon,
  SearchIcon,
  ShieldCheckIcon,
  SlidersIcon,
  WrenchIcon,
} from "@/components/icons";

const ICON_MAP: Record<
  string,
  { Icon: (p: { className?: string; strokeWidth?: number }) => React.ReactNode; tile: string }
> = {
  alert: { Icon: AlertIcon, tile: "bg-danger-soft text-danger" },
  bell: { Icon: BellIcon, tile: "bg-brand-soft text-brand" },
  building: { Icon: BuildingIcon, tile: "bg-tint-indigo text-tint-indigo-fg" },
  wrench: { Icon: WrenchIcon, tile: "bg-tint-amber text-tint-amber-fg" },
  calendar: { Icon: CalendarCheckIcon, tile: "bg-tint-emerald text-tint-emerald-fg" },
  shield: { Icon: ShieldCheckIcon, tile: "bg-tint-purple text-tint-purple-fg" },
  chart: { Icon: ChartIcon, tile: "bg-brand-soft text-brand" },
  file: { Icon: FileTextIcon, tile: "bg-tint-teal text-tint-teal-fg" },
};

export default function MenuPage() {
  return (
    <div className="md:max-w-2xl">
      <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-card px-4 py-3.5 text-sm text-sub">
        <SearchIcon className="h-[18px] w-[18px]" strokeWidth={2.2} />
        <span>민원, 작업, 설비 통합 검색</span>
      </div>

      {MENU_GROUPS.map((g, gi) => (
        <section
          key={g.title}
          className="rise mt-7"
          style={{ animationDelay: `${gi * 80}ms` }}
        >
          <h2 className="px-1 text-[13px] font-bold text-sub">{g.title}</h2>
          <div className="mt-2.5 overflow-hidden rounded-[20px] bg-card">
            {g.items.map((item, i) => {
              const m = ICON_MAP[item.icon];
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-4 py-3.5 ${
                    i > 0 ? "border-t border-page" : ""
                  } ${item.ready ? "" : "opacity-50"}`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${m.tile}`}
                  >
                    <m.Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-semibold">{item.label}</div>
                    <div className="mt-0.5 text-xs text-sub">{item.desc}</div>
                  </div>
                  {item.ready ? (
                    <ChevronIcon className="h-4 w-4 text-mute" strokeWidth={2.4} />
                  ) : (
                    <span className="shrink-0 rounded-full bg-elev px-2.5 py-1 text-[10px] font-bold text-sub">
                      데이터가 쌓이면 열려요
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <TeamList />
      <AccountPanel />

      <section className="rise mt-7" style={{ animationDelay: "340ms" }}>
        <h2 className="px-1 text-[13px] font-bold text-sub">설정</h2>
        <div className="mt-2.5 overflow-hidden rounded-[20px] bg-card">
          <Link
            href="/landing"
            className="flex items-center gap-3 px-4 py-3.5 active:bg-line"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tint-indigo text-tint-indigo-fg">
              <BuildingIcon className="h-5 w-5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold">서비스 소개</div>
              <div className="mt-0.5 text-xs text-sub">
                BFS OS가 무엇을 하는지 한 장으로
              </div>
            </div>
            <ChevronIcon className="h-4 w-4 text-mute" strokeWidth={2.4} />
          </Link>
          <Link
            href="/pricing"
            className="flex items-center gap-3 border-t border-page px-4 py-3.5 active:bg-line"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <CardIcon className="h-5 w-5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold">이용 안내</div>
              <div className="mt-0.5 text-xs text-sub">
                지금은 무료 체험 기간이에요
              </div>
            </div>
            <ChevronIcon className="h-4 w-4 text-mute" strokeWidth={2.4} />
          </Link>
          <div className="flex items-center gap-3 border-t border-page px-4 py-3.5 opacity-50">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-line text-ink2">
              <SlidersIcon className="h-5 w-5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1 text-[15px] font-semibold">빌딩 설정</div>
            <span className="shrink-0 rounded-full bg-elev px-2.5 py-1 text-[10px] font-bold text-sub">
              준비 중
            </span>
          </div>
        </div>
      </section>

      <p className="mt-8 text-center text-xs text-sub">
        BFS OS — 접수·배정·처리. 나머지는 필요할 때.
      </p>
    </div>
  );
}
