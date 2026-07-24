import Link from "next/link";
import { MENU_GROUPS } from "@/lib/mock";

export default function MenuPage() {
  return (
    <div>
      <div className="mt-2 flex items-center gap-2 rounded-xl bg-card px-4 py-3 text-sm text-sub shadow-sm">
        🔍 <span>민원, 작업, 설비 통합 검색</span>
      </div>

      {MENU_GROUPS.map((g) => (
        <section key={g.title} className="mt-6">
          <h2 className="px-1 text-[13px] font-bold text-sub">{g.title}</h2>
          <div className="mt-2 overflow-hidden rounded-2xl bg-card shadow-sm">
            {g.items.map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-4 py-3.5 ${
                  i > 0 ? "border-t border-line" : ""
                } ${item.ready ? "" : "opacity-45"}`}
              >
                <div>
                  <div className="text-[15px] font-semibold">{item.label}</div>
                  <div className="text-xs text-sub">{item.desc}</div>
                </div>
                {item.ready ? (
                  <span className="text-sub">›</span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                    데이터가 쌓이면 열려요
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-6">
        <h2 className="px-1 text-[13px] font-bold text-sub">설정</h2>
        <div className="mt-2 overflow-hidden rounded-2xl bg-card shadow-sm">
          <Link
            href="/pricing"
            className="flex items-center justify-between px-4 py-3.5"
          >
            <div>
              <div className="text-[15px] font-semibold">요금제</div>
              <div className="text-xs text-sub">
                공개 요금표 — 상담 없이 오늘 시작
              </div>
            </div>
            <span className="text-sub">›</span>
          </Link>
          <div className="border-t border-line px-4 py-3.5 text-[15px] font-semibold">
            프로필 · 구성원 · 빌딩 설정
          </div>
        </div>
      </section>

      <p className="mt-8 text-center text-xs text-sub">
        BFS OS v2 Beta — 핵심 4개만 전면에, 나머지는 필요한 순간에.
      </p>
    </div>
  );
}
