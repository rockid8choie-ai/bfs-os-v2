import { randomUUID } from "crypto";
import { ApiError, badRequest } from "./errors";

export { PLANS } from "@/lib/plans";

// 토스페이먼츠 — env 우선, 없으면 공식 샘플 레포의 공개 샌드박스 키 쌍(실결제 불가).
export const TOSS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
const TOSS_SECRET_KEY =
  process.env.TOSS_SECRET_KEY ?? "test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R";

export function newOrderId() {
  return `bfsos_${randomUUID().replace(/-/g, "")}`;
}

export type TossPayment = {
  paymentKey: string;
  orderId: string;
  status: string;
  totalAmount: number;
  method?: string;
  approvedAt?: string;
  receipt?: { url?: string };
};

export async function confirmTossPayment(input: {
  paymentKey: string;
  orderId: string;
  amount: number;
}): Promise<TossPayment> {
  const auth = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");
  let res: Response;
  try {
    res = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
  } catch {
    throw new ApiError(502, "PG_UNREACHABLE", "결제사 서버에 연결하지 못했습니다.");
  }

  const body = (await res.json().catch(() => null)) as
    | (TossPayment & { code?: string; message?: string })
    | null;

  if (!res.ok || !body || body.code) {
    throw badRequest(
      body?.message ?? "결제 승인에 실패했습니다.",
      body?.code ?? "PG_CONFIRM_FAILED"
    );
  }
  return body;
}
