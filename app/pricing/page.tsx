import { PLANS } from "@/lib/mock";

export default function PricingPage() {
  return (
    <div>
      <h1 className="mt-2 text-xl font-bold">요금</h1>
      <p className="mt-1 text-sm text-sub">
        상담 없이 시작하세요 — 카드 등록하면 오늘부터.
        <br />
        민원 넣는 입주사는 <b className="text-ink">언제나 무료</b>, 일하는
        시설팀만 과금합니다.
      </p>

      <div className="mt-4 space-y-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl bg-card p-4 shadow-sm ${
              p.highlight ? "border-2 border-brand" : ""
            }`}
          >
            <div className="flex items-baseline justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold">{p.name}</span>
                {p.highlight && (
                  <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                    추천
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold">{p.price}</span>
                <span className="ml-1 text-xs text-sub">{p.unit}</span>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-brand">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              className={`mt-4 w-full rounded-lg py-2.5 text-sm font-bold ${
                p.highlight
                  ? "bg-brand text-white"
                  : "border border-line text-ink"
              }`}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-card p-4 text-xs leading-relaxed text-sub shadow-sm">
        <b className="text-ink">위탁사·다건물 운영</b> — 5개 동부터 20% 할인,
        조직 단위 통합 권한 제공. 견적 문의는 앱 내 채팅으로.
        <br />
        VAT 별도 · 연납 시 2개월 무료.
      </div>
    </div>
  );
}
