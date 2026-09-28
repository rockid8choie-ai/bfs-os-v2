import { prisma } from "@/lib/server/db";
import { hashPassword } from "@/lib/server/auth";
import { verifyResetToken } from "@/lib/server/jwt";
import { badRequest, jsonError, jsonOk } from "@/lib/server/errors";
import { parseBody, resetConfirmSchema } from "@/lib/server/validators";

export const runtime = "nodejs";

// 재설정 링크의 토큰으로 새 비밀번호 저장. 토큰은 발급 시점 해시와 대조해 1회용.
export async function POST(request: Request) {
  try {
    const raw = await request.json().catch(() => null);
    const body = parseBody(resetConfirmSchema, raw);

    const payload = await verifyResetToken(body.token);
    if (!payload) {
      throw badRequest("링크가 만료됐거나 올바르지 않습니다. 다시 요청해 주세요.", "RESET_EXPIRED");
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || (user.passwordHash ?? "").slice(-10) !== payload.ph) {
      throw badRequest("이미 사용된 링크입니다. 다시 요청해 주세요.", "RESET_USED");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(body.newPassword) },
    });

    return jsonOk({ changed: true });
  } catch (error) {
    return jsonError(error);
  }
}
