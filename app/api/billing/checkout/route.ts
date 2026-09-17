import { prisma } from "@/lib/server/db";
import { requireUser } from "@/lib/server/auth";
import { forbidden, jsonError, jsonOk } from "@/lib/server/errors";
import { newOrderId, PLANS, TOSS_CLIENT_KEY } from "@/lib/server/billing";
import { BILLING_LIVE } from "@/lib/plans";
import { checkoutSchema, parseBody } from "@/lib/server/validators";

export const runtime = "nodejs";

// 결제 준비 — 소장만. 주문을 만들어 두고 클라이언트가 토스 결제창을 띄운다.
export async function POST(request: Request) {
  try {
    const me = await requireUser();
    if (!BILLING_LIVE) throw forbidden("지금은 무료 기간이라 결제를 받지 않습니다.");
    if (me.role !== "manager") throw forbidden("결제는 관리소장만 할 수 있습니다.");

    const raw = await request.json().catch(() => null);
    const body = parseBody(checkoutSchema, raw);
    const plan = PLANS[body.plan];

    const payment = await prisma.payment.create({
      data: {
        buildingId: me.buildingId,
        orderId: newOrderId(),
        plan: body.plan,
        amount: plan.monthly,
        status: "ready",
        requestedById: me.id,
      },
    });

    return jsonOk({
      orderId: payment.orderId,
      amount: payment.amount,
      plan: body.plan,
      orderName: `BFS OS ${plan.label} 월 이용권 — ${me.buildingName}`,
      clientKey: TOSS_CLIENT_KEY,
      customerKey: me.id,
      customerEmail: me.email,
      customerName: me.name,
    });
  } catch (error) {
    return jsonError(error);
  }
}
