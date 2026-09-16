"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckIcon, SparkIcon } from "@/components/icons";
import { api } from "@/lib/api";
import { useIsNativeApp } from "@/lib/native";
import { PLANS, won, type PlanKey } from "@/lib/plans";
import { useApp } from "@/lib/store";
import { loadTossPayments } from "@/lib/toss";

type Billing = {
  plan: PlanKey;
  planLabel: string;
  planUpdatedAt: string | null;
  payments: {
    id: string;
    plan: PlanKey;
    amount: number;
    status: string;
    method: string | null;
    receiptUrl: string | null;
    approvedAt: string | null;
    createdAt: string;
  }[];
};

function PlanCard({
  plan,
  current,
  highlight,
  action,
}: {
  plan: PlanKey;
  current: boolean;
  highlight?: boolean;
  action?: React.ReactNode;
}) {
  const p = PLANS[plan];
  return (
    <div
      className={`rounded-[20px] p-5 ${
        highlight ? "bg-brand-soft ring-1 ring-brand/30" : "bg-card"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-extrabold">{p.label}</span>
          {current && (
            <span className="rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold text-white">
              현재 플랜
            </span>
          )}
        </div>
        <span className="text-[13px] text-sub">{p.tagline}</span>
      </div>
      <div className="mt-2 text-[22px] font-extrabold tracking-[-0.02em]">
        {p.monthly === 0 ? "무료" : `월 ${won(p.monthly)}원`}
        {p.monthly > 0 && <span className="text-[12px] font-semibold text-sub"> / 빌딩</span>}
      </div>
      <ul className="mt-3 space-y-1.5 text-[13px]">
        {p.features.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 shrink-0 text-brand" strokeWidth={3} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {action}
    </div>
  );
}

export default function PricingPage() {
  const { me, ready, authenticated } = useApp();
  const native = useIsNativeApp();
  const [billing, setBilling] = useState<Billing | null>(null);
  const [busy, setBusy] = useState<PlanKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isManager = me?.role === "manager";

  useEffect(() => {
    if (!ready || !authenticated) return;
    api
      .get<Billing>("/api/billing")
      .then(setBilling)
      .catch(() => setBilling(null));
  }, [ready, authenticated]);

  const checkout = async (plan: Exclude<PlanKey, "free">) => {
    setBusy(plan);
    setError(null);
    try {
      const order = await api.post<{
        orderId: string;
        amount: number;
        orderName: string;
        clientKey: string;
        customerKey: string;
        customerEmail?: string;
        customerName?: string;
      }>("/api/billing/checkout", { plan });

      const TossPayments = await loadTossPayments();
      const payment = TossPayments(order.clientKey).payment({
        customerKey: order.customerKey,
      });
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: order.amount },
        orderId: order.orderId,
        orderName: order.orderName,
        successUrl: `${window.location.origin}/pay/success`,
        failUrl: `${window.location.origin}/pay/fail`,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        card: {
          useEscrow: false,
          flowMode: "DEFAULT",
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    } catch (err) {
      // 결제창 닫기(사용자 취소)도 여기로 온다 — 조용히 안내만.
      setError(err instanceof Error ? err.message : "결제를 시작하지 못했습니다.");
    } finally {
      setBusy(null);
    }
  };

  const downgrade = async () => {
    setBusy("free");
    setError(null);
    try {
      await api.del("/api/billing");
      const next = await api.get<Billing>("/api/billing");
      setBilling(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "플랜 변경에 실패했습니다.");
    } finally {
      setBusy(null);
    }
  };

  const currentPlan: PlanKey = billing?.plan ?? "free";

  // 네이티브 앱(스토어 배포판)에서는 결제·금액을 노출하지 않는다.
  if (native) {
    return (
      <div className="md:max-w-2xl">
        <h1 className="mt-3 text-[24px] font-extrabold tracking-[-0.02em]">이용 안내</h1>
        <div className="mt-5 rounded-[20px] bg-brand-soft p-5">
          <div className="flex items-center gap-2">
            <SparkIcon className="h-4 w-4 text-brand" strokeWidth={2.4} />
            <span className="text-[13px] font-bold text-brand">
              현재 플랜 — {PLANS[currentPlan].label}
            </span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-ink2">
            민원을 넣는 입주사는 언제나 무료입니다. 플랜과 청구 관리는 관리소장이
            운영 콘솔에서 할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:max-w-2xl">
      <h1 className="mt-3 text-[24px] font-extrabold tracking-[-0.02em]">요금</h1>
      <p className="mt-1 text-sm leading-relaxed text-sub">
        빌딩당 월 요금, 숨긴 금액 없이 공개합니다. 입주사는 언제나 무료입니다.
      </p>

      <div className="mt-5 space-y-3">
        <PlanCard
          plan="free"
          current={currentPlan === "free"}
          action={
            !authenticated ? (
              <Link
                href="/signup"
                className="mt-4 block w-full rounded-xl bg-brand py-3.5 text-center text-sm font-bold text-white active:opacity-80"
              >
                무료로 시작하기
              </Link>
            ) : currentPlan !== "free" && isManager ? (
              <button
                onClick={() => void downgrade()}
                disabled={busy !== null}
                className="mt-4 w-full rounded-xl bg-page py-3 text-sm font-bold text-ink2 disabled:opacity-40"
              >
                {busy === "free" ? "변경 중…" : "무료 플랜으로 전환"}
              </button>
            ) : null
          }
        />
        {(["standard", "pro"] as const).map((plan) => (
          <PlanCard
            key={plan}
            plan={plan}
            current={currentPlan === plan}
            highlight={plan === "standard"}
            action={
              authenticated && isManager && currentPlan !== plan ? (
                <button
                  onClick={() => void checkout(plan)}
                  disabled={busy !== null}
                  className="mt-4 w-full rounded-xl bg-brand py-3.5 text-sm font-bold text-white active:opacity-80 disabled:opacity-40"
                >
                  {busy === plan ? "결제창 여는 중…" : `${PLANS[plan].label} 시작하기`}
                </button>
              ) : !authenticated ? (
                <Link
                  href={`/login?next=${encodeURIComponent("/pricing")}`}
                  className="mt-4 block w-full rounded-xl bg-page py-3.5 text-center text-sm font-bold text-ink2 active:opacity-80"
                >
                  로그인 후 결제
                </Link>
              ) : null
            }
          />
        ))}
      </div>

      {error && (
        <p className="mt-3 rounded-2xl bg-danger-soft px-4 py-3 text-[13px] font-semibold text-danger">
          {error}
        </p>
      )}

      {billing && billing.payments.length > 0 && (
        <section className="mt-7">
          <h2 className="px-1 text-[13px] font-bold text-sub">결제 이력</h2>
          <div className="mt-2.5 overflow-hidden rounded-[20px] bg-card">
            {billing.payments.map((p, i) => (
              <div
                key={p.id}
                className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? "border-t border-page" : ""}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-bold">
                    {PLANS[p.plan].label} · {won(p.amount)}원
                  </div>
                  <div className="mt-0.5 text-xs text-sub">
                    {new Date(p.approvedAt ?? p.createdAt).toLocaleDateString("ko-KR")}
                    {p.method ? ` · ${p.method}` : ""}
                  </div>
                </div>
                {p.receiptUrl ? (
                  <a
                    href={p.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-full bg-page px-3 py-1.5 text-[12px] font-bold text-ink2"
                  >
                    영수증
                  </a>
                ) : (
                  <span className="shrink-0 text-[12px] font-bold text-sub">
                    {p.status === "canceled" ? "취소됨" : ""}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-3 rounded-[20px] bg-card p-5 text-xs leading-relaxed text-sub">
        결제는 토스페이먼츠를 통해 처리되며, 카드 정보는 저장하지 않습니다. 위탁사·다건물
        운영은 조직 단위 통합 권한을 별도로 제공합니다 — 문의는 앱 내 채팅으로 남겨주세요.
      </div>
    </div>
  );
}
