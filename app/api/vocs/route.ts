import { prisma } from "@/lib/server/db";
import { requireUser } from "@/lib/server/auth";
import { jsonError, jsonOk } from "@/lib/server/errors";
import { mapVoc } from "@/lib/server/map";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireUser();
    const rows = await prisma.voc.findMany({
      where: { buildingId: user.buildingId },
      include: { workOrder: { select: { id: true } } },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk({ vocs: rows.map(mapVoc) });
  } catch (error) {
    return jsonError(error);
  }
}
