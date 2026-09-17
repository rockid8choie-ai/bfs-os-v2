import { prisma } from "@/lib/server/db";
import { establishSession, verifyPassword } from "@/lib/server/auth";
import { jsonError, jsonOk, unauthorized } from "@/lib/server/errors";
import { loginSchema, parseBody } from "@/lib/server/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const raw = await request.json().catch(() => null);
    const body = parseBody(loginSchema, raw);
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      include: { building: true },
    });

    if (user && !user.passwordHash) {
      throw unauthorized("소셜 로그인으로 가입된 계정입니다. 소셜 버튼으로 로그인해 주세요.");
    }
    const valid =
      user && user.passwordHash ? await verifyPassword(body.password, user.passwordHash) : false;
    if (!user || !valid) {
      throw unauthorized("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    return jsonOk(await establishSession(user));
  } catch (error) {
    return jsonError(error);
  }
}
