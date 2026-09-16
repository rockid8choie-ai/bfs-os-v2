import { prisma } from "@/lib/server/db";
import { hashPassword, requireUser, verifyPassword } from "@/lib/server/auth";
import { badRequest, jsonError, jsonOk } from "@/lib/server/errors";
import { changePasswordSchema, parseBody } from "@/lib/server/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const me = await requireUser();
    const raw = await request.json().catch(() => null);
    const body = parseBody(changePasswordSchema, raw);

    const account = await prisma.user.findUnique({ where: { id: me.id } });
    if (!account || !(await verifyPassword(body.currentPassword, account.passwordHash))) {
      throw badRequest("현재 비밀번호가 올바르지 않습니다.", "WRONG_PASSWORD");
    }

    await prisma.user.update({
      where: { id: me.id },
      data: { passwordHash: await hashPassword(body.newPassword) },
    });

    return jsonOk({ changed: true });
  } catch (error) {
    return jsonError(error);
  }
}
