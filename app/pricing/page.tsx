import { PLANS } from "@/lib/mock";
import { CheckIcon } from "@/components/icons";

export default function PricingPage() {
  return (
    <div>
      <h1 className="mt-3 text-[24px] font-extrabold tracking-[-0.02em]">요금</h1>
      <p className="mt-1 text-sm leading-relaxed text-sub">
        상담 없이 시작하세요 — 카드 등록하면 오늘부터.
        <br />
        민원 넣는 입주사는 <b className="text-ink">언제나 무료</b>, 일하는
        시설팀만 과금합니다.
      </p>

      <div className="mt-5 space-y-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`rounded-[20px] p-5 ${
              p.highlight ? "bg-brand-soft" : "bg-card"
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
                <span className="text-xl font-extrabold tracking-tight">
                  {p.price}
                </span>
                <span className="ml-1 text-xs text-sub">{p.unit}</span>
              </div>
            </div>
            <ul className="mt-3.5 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckIcon
                    className="h-4 w-4 shrink-0 text-brand"
                    strokeWidth={3}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              className={`mt-4 w-full rounded-xl py-3 text-sm font-bold active:opacity-80 ${
                p.highlight
                  ? "bg-brand text-white"
                  : "bg-elev text-ink2"
              }`}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[20px] bg-card p-5 text-xs leading-relaxed text-sub">
        <b className="text-ink">위탁사·다건물 운영</b> — 5개 동부터 20% 할인,
        조직 단위 통합 권한 제공. 견적 문의는 앱 내 채팅으로.
        <br />
        VAT 별도 · 연납 시 2개월 무료.
      </div>
    </div>
  );
}
