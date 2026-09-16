"use client";

// 토스페이먼츠 v2 SDK 로더 — 결제 시점에만 로드한다.
type TossPaymentsFn = (clientKey: string) => {
  payment: (opts: { customerKey: string }) => {
    requestPayment: (opts: {
      method: "CARD";
      amount: { currency: "KRW"; value: number };
      orderId: string;
      orderName: string;
      successUrl: string;
      failUrl: string;
      customerEmail?: string;
      customerName?: string;
      card?: { useEscrow: boolean; flowMode: "DEFAULT"; useCardPoint: boolean; useAppCardOnly: boolean };
    }) => Promise<void>;
  };
};

declare global {
  interface Window {
    TossPayments?: TossPaymentsFn;
  }
}

const SDK_URL = "https://js.tosspayments.com/v2/standard";

export function loadTossPayments(): Promise<TossPaymentsFn> {
  return new Promise((resolve, reject) => {
    if (window.TossPayments) return resolve(window.TossPayments);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`);
    const script = existing ?? document.createElement("script");
    const onload = () => {
      if (window.TossPayments) resolve(window.TossPayments);
      else reject(new Error("결제 모듈을 불러오지 못했습니다."));
    };
    if (existing) {
      existing.addEventListener("load", onload);
      existing.addEventListener("error", () =>
        reject(new Error("결제 모듈을 불러오지 못했습니다."))
      );
      if (window.TossPayments) resolve(window.TossPayments);
      return;
    }
    script.src = SDK_URL;
    script.async = true;
    script.onload = onload;
    script.onerror = () => reject(new Error("결제 모듈을 불러오지 못했습니다."));
    document.head.appendChild(script);
  });
}
