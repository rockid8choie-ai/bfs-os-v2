import { cookies } from "next/headers";
import { prisma } from "@/lib/server/db";
import {
  cookieOptions,
  requireUser,
  SESSION_COOKIE,
  toPublicUser,
  verifyPassword,
} from "@/lib/server/auth";
import { badRequest, jsonError, jsonOk } from "@/lib/server/errors";
import {
  deleteAccountSchema,
  parseBody,
  updateProfileSchema,
} from "@/lib/server/validators";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk({ user: toPublicUser(user) });
  } catch (error) {
    return jsonError(error);
  }
}

// 프로필 수정 — 이름·직함·연락처·전문 분야만. 이메일·역할은 불변.
export async function PATCH(request: Request) {
  try {
    const me = await requireUser();
    const raw = await request.json().catch(() => null);
    const body = parseBody(updateProfileSchema, raw);

    const updated = await prisma.user.update({
      where: { id: me.id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.phone !== undefined ? { phone: body.phone } : {}),
        ...(body.specialties !== undefined ? { specialties: body.specialties } : {}),
      },
      include: { building: true },
    });

    return jsonOk({
      user: toPublicUser({
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
        title: updated.title,
        phone: updated.phone,
        years: updated.years,
        specialty: updated.specialties,
        buildingId: updated.buildingId,
        buildingName: updated.building.name,
      }),
    });
  } catch (error) {
    return jsonError(error);
  }
}

// 회원 탈퇴 — 소장은 빌딩 전체(팀원·작업·민원·결제 이력 포함) 삭제, 팀원은 본인 계정만.
export async function DELETE(request: Request) {
  try {
    const me = await requireUser();
    const raw = await request.json().catch(() => null);
    const body = parseBody(deleteAccountSchema, raw);

    const account = await prisma.user.findUnique({ where: { id: me.id } });
    if (!account || !(await verifyPassword(body.password, account.passwordHash))) {
      throw badRequest("비밀번호가 올바르지 않습니다.", "WRONG_PASSWORD");
    }

    if (me.role === "manager") {
      await prisma.building.delete({ where: { id: me.buildingId } });
    } else {
      await prisma.user.delete({ where: { id: me.id } });
    }

    const jar = await cookies();
    jar.set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
    return jsonOk({ deleted: true, scope: me.role === "manager" ? "building" : "user" });
  } catch (error) {
    return jsonError(error);
  }
}
