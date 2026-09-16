import { prisma } from "@/lib/server/db";
import { requireUser } from "@/lib/server/auth";
import { badRequest, jsonError, jsonOk, notFound } from "@/lib/server/errors";
import { confirmTossPayment } from "@/lib/server/billing";
import { confirmPaymentSchema, parseBody } from "@/lib/server/validators";

export const runtime = "nodejs";

// 결제 승인 — 토스 successUrl 리다이렉트 후 서버가 최종 승인한다.
// 금액은 우리가 만들어 둔 주문(Payment)과 대조해 위·변조를 막는다.
export async function POST(request: Request) {
  try {
    const me = await requireUser();
    const raw = await request.json().catch(() => null);
    const body = parseBody(confirmPaymentSchema, raw);

    const payment = await prisma.payment.findUnique({ where: { orderId: body.orderId } });
    if (!payment || payment.buildingId !== me.buildingId) {
      throw notFound("주문을 찾을 수 없습니다.");
    }
    if (payment.status === "paid") {
      return jsonOk({ plan: payment.plan, alreadyPaid: true });
    }
    if (payment.amount !== body.amount) {
      throw badRequest("결제 금액이 주문과 다릅니다.", "AMOUNT_MISMATCH");
    }

    let confirmed;
    try {
      confirmed = await confirmTossPayment(body);
    } catch (error) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "failed",
          failReason: error instanceof Error ? error.message : "승인 실패",
        },
      });
      throw error;
    }

    const [updated] = await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "paid",
          paymentKey: confirmed.paymentKey,
          method: confirmed.method ?? null,
          receiptUrl: confirmed.receipt?.url ?? null,
          approvedAt: confirmed.approvedAt ? new Date(confirmed.approvedAt) : new Date(),
        },
      }),
      prisma.building.update({
        where: { id: payment.buildingId },
        data: { plan: payment.plan, planUpdatedAt: new Date() },
      }),
    ]);

    return jsonOk({
      plan: updated.plan,
      amount: updated.amount,
      receiptUrl: updated.receiptUrl,
      approvedAt: updated.approvedAt,
    });
  } catch (error) {
    return jsonError(error);
  }
}
