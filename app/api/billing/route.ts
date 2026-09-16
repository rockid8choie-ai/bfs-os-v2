import { prisma } from "@/lib/server/db";
import { requireUser } from "@/lib/server/auth";
import { forbidden, jsonError, jsonOk, notFound } from "@/lib/server/errors";
import { PLANS } from "@/lib/server/billing";

export const runtime = "nodejs";

// 현재 플랜 + 결제 이력 — 빌딩 구성원 누구나 조회 가능.
export async function GET() {
  try {
    const me = await requireUser();
    const building = await prisma.building.findUnique({
      where: { id: me.buildingId },
      include: {
        payments: {
          where: { status: { in: ["paid", "canceled"] } },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });
    if (!building) throw notFound("빌딩을 찾을 수 없습니다.");

    return jsonOk({
      plan: building.plan,
      planLabel: PLANS[building.plan].label,
      planUpdatedAt: building.planUpdatedAt,
      payments: building.payments.map((p) => ({
        id: p.id,
        orderId: p.orderId,
        plan: p.plan,
        amount: p.amount,
        status: p.status,
        method: p.method,
        receiptUrl: p.receiptUrl,
        approvedAt: p.approvedAt,
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    return jsonError(error);
  }
}

// 무료 플랜으로 전환 — 소장만.
export async function DELETE() {
  try {
    const me = await requireUser();
    if (me.role !== "manager") throw forbidden("플랜 변경은 관리소장만 할 수 있습니다.");

    await prisma.building.update({
      where: { id: me.buildingId },
      data: { plan: "free", planUpdatedAt: new Date() },
    });
    return jsonOk({ plan: "free" });
  } catch (error) {
    return jsonError(error);
  }
}
