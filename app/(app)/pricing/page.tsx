import Link from "next/link";
import { TRIAL_FEATURES } from "@/lib/mock";
import { CheckIcon, SparkIcon } from "@/components/icons";

export default function PricingPage() {
  return (
    <div className="md:max-w-2xl">
      <h1 className="mt-3 text-[24px] font-extrabold tracking-[-0.02em]">이용 안내</h1>
      <p className="mt-1 text-sm leading-relaxed text-sub">
        지금은 <b className="text-ink">무료 체험</b> 기간입니다.
        <br />
        카드 등록 없이, 모든 기능을 열어두고 있어요.
      </p>

      <div className="mt-5 rounded-[20px] bg-brand-soft p-5">
        <div className="flex items-center gap-2">
          <SparkIcon className="h-4 w-4 text-brand" strokeWidth={2.4} />
          <span className="text-[13px] font-bold text-brand">베타 무료 체험</span>
        </div>
        <div className="mt-2 text-[20px] font-extrabold tracking-[-0.02em]">
          기능 제한 없이 무료
        </div>
        <p className="mt-1 text-[13px] text-ink2">
          빌딩 1개부터 바로 시작할 수 있습니다.
        </p>

        <ul className="mt-4 space-y-2 text-sm">
          {TRIAL_FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 shrink-0 text-brand" strokeWidth={3} />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/"
          className="mt-4 block w-full rounded-xl bg-brand py-3 text-center text-sm font-bold text-white active:opacity-80"
        >
          무료로 시작하기
        </Link>
      </div>

      <div className="mt-3 rounded-[20px] bg-card p-5 text-xs leading-relaxed text-sub">
        민원을 넣는 <b className="text-ink">입주사는 언제나 무료</b>입니다. 정식 요금은
        베타가 끝나기 전에 미리 안내드리고, 그때까지 쓰신 데이터와 이력은 그대로
        유지됩니다.
        <br />
        <br />
        위탁사·다건물 운영은 조직 단위 통합 권한을 별도로 제공합니다. 문의는 앱 내
        채팅으로 남겨주세요.
      </div>
    </div>
  );
}
