import { cookies } from "next/headers";
import { prisma } from "@/lib/server/db";
import {
  cookieOptions,
  signToken,
  SESSION_COOKIE,
  toPublicUser,
  verifyPassword,
} from "@/lib/server/auth";
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

    const valid = user ? await verifyPassword(body.password, user.passwordHash) : false;
    if (!user || !valid) {
      throw unauthorized("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    const token = await signToken({
      id: user.id,
      role: user.role,
      buildingId: user.buildingId,
      email: user.email,
    });

    const jar = await cookies();
    jar.set(SESSION_COOKIE, token, cookieOptions());

    return jsonOk({
      token,
      user: toPublicUser({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        title: user.title,
        phone: user.phone,
        years: user.years,
        specialty: user.specialties,
        buildingId: user.buildingId,
        buildingName: user.building.name,
      }),
    });
  } catch (error) {
    return jsonError(error);
  }
}
