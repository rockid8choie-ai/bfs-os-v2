import { prisma } from "@/lib/server/db";
import { requireUser } from "@/lib/server/auth";
import { badRequest, forbidden, jsonError, jsonOk, notFound } from "@/lib/server/errors";

export const runtime = "nodejs";

// 팀원 삭제 — 소장만, 같은 빌딩의 tech 계정만. 배정 중이던 작업은 미배정으로 돌아간다.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const me = await requireUser();
    if (me.role !== "manager") throw forbidden("팀원 삭제는 관리소장만 할 수 있습니다.");

    const { id } = await params;
    if (id === me.id) throw badRequest("본인 계정은 계정 탈퇴에서 삭제해 주세요.");

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target || target.buildingId !== me.buildingId) throw notFound();
    if (target.role !== "tech") throw badRequest("시설팀 계정만 삭제할 수 있습니다.");

    await prisma.user.delete({ where: { id } });
    return jsonOk({ deleted: true });
  } catch (error) {
    return jsonError(error);
  }
}
