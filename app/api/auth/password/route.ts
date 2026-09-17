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
    if (!account) throw badRequest("계정을 찾을 수 없습니다.");
    // 기존 비밀번호가 있으면 검증, 없으면(소셜 가입) 바로 새 비밀번호를 만든다.
    if (account.passwordHash) {
      const ok = body.currentPassword
        ? await verifyPassword(body.currentPassword, account.passwordHash)
        : false;
      if (!ok) throw badRequest("현재 비밀번호가 올바르지 않습니다.", "WRONG_PASSWORD");
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
