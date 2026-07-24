import Link from "next/link";
import { MENU_GROUPS } from "@/lib/mock";

export default function MenuPage() {
  return (
    <div>
      <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-card px-4 py-3.5 text-sm text-sub">
        🔍 <span>민원, 작업, 설비 통합 검색</span>
      </div>

      {MENU_GROUPS.map((g) => (
        <section key={g.title} className="mt-7">
          <h2 className="px-1 text-[13px] font-bold text-sub">{g.title}</h2>
          <div className="mt-2.5 overflow-hidden rounded-[20px] bg-card">
            {g.items.map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-4 py-4 ${
                  i > 0 ? "border-t border-white" : ""
                } ${item.ready ? "" : "opacity-45"}`}
              >
                <div>
                  <div className="text-[15px] font-semibold">{item.label}</div>
                  <div className="mt-0.5 text-xs text-sub">{item.desc}</div>
                </div>
                {item.ready ? (
                  <span className="text-mute">›</span>
                ) : (
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-sub">
                    데이터가 쌓이면 열려요
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-7">
        <h2 className="px-1 text-[13px] font-bold text-sub">설정</h2>
        <div className="mt-2.5 overflow-hidden rounded-[20px] bg-card">
          <Link
            href="/pricing"
            className="flex items-center justify-between px-4 py-4 active:bg-line"
          >
            <div>
              <div className="text-[15px] font-semibold">요금제</div>
              <div className="mt-0.5 text-xs text-sub">
                공개 요금표 — 상담 없이 오늘 시작
              </div>
            </div>
            <span className="text-mute">›</span>
          </Link>
          <div className="border-t border-white px-4 py-4 text-[15px] font-semibold">
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
