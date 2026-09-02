import { prisma } from "@/lib/server/db";
import { requireUser } from "@/lib/server/auth";
import { forbidden, jsonError, jsonOk, notFound } from "@/lib/server/errors";
import { mapVoc, mapWorkOrder } from "@/lib/server/map";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    if (user.role !== "manager") {
      throw forbidden("민원 전환은 관리소장만 할 수 있습니다.");
    }

    const { id } = await context.params;
    const voc = await prisma.voc.findFirst({
      where: { id, buildingId: user.buildingId },
      include: { workOrder: true },
    });
    if (!voc) throw notFound("민원을 찾을 수 없습니다.");

    if (voc.workOrder) {
      return jsonOk({
        order: mapWorkOrder(voc.workOrder),
        voc: mapVoc(voc),
        created: false,
      });
    }

    const unit = voc.tenant.split(" · ")[0] ?? voc.tenant;
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.workOrder.create({
        data: {
          buildingId: user.buildingId,
          title: `${unit} ${voc.title}`,
          location: unit || "위치 미지정",
          due: "오늘",
          status: "pending",
          priority: "high",
          source: "민원",
          specialty: voc.specialty ?? "배관·급수",
          vocId: voc.id,
        },
      });
      const nextVoc = await tx.voc.update({
        where: { id: voc.id },
        data: { status: "processing" },
        include: { workOrder: { select: { id: true } } },
      });
      return { order, voc: nextVoc };
    });

    return jsonOk(
      {
        order: mapWorkOrder(result.order),
        voc: mapVoc(result.voc),
        created: true,
      },
      201
    );
  } catch (error) {
    return jsonError(error);
  }
}
