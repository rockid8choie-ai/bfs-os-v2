import { prisma } from "@/lib/server/db";
import { requireUser } from "@/lib/server/auth";
import { jsonError, jsonOk } from "@/lib/server/errors";
import { mapWorkOrder, priorityFromUi } from "@/lib/server/map";
import { assignOrder, listOrdersFor, recommendAssignee } from "@/lib/server/orders";
import { createOrderSchema, parseBody } from "@/lib/server/validators";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireUser();
    const orders = await listOrdersFor(user);
    return jsonOk({ orders });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const input = parseBody(createOrderSchema, await request.json());

    const created = await prisma.workOrder.create({
      data: {
        buildingId: user.buildingId,
        title: input.title,
        location: input.location?.trim() || "위치 미지정",
        due: input.due?.trim() || "오늘",
        status: "pending",
        priority: priorityFromUi(input.priority),
        source: input.source,
        specialty: input.specialty,
        vocId: input.vocId,
      },
    });

    const shouldAssign =
      Boolean(input.assigneeId) ||
      input.autoAssign !== false ||
      user.role === "tech";

    if (!shouldAssign) {
      return jsonOk({ order: mapWorkOrder(created) }, 201);
    }

    let assigneeId = input.assigneeId;
    if (!assigneeId && user.role === "tech") {
      assigneeId = user.id;
    }
    if (!assigneeId) {
      const rec = await recommendAssignee(user.buildingId, input.specialty, input.priority);
      assigneeId = rec?.member.id ?? user.id;
    }

    const order = await assignOrder(user, created.id, assigneeId);
    return jsonOk({ order }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
