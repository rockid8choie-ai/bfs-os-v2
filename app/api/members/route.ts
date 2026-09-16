import { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/server/db";
import { hashPassword, requireUser } from "@/lib/server/auth";
import { badRequest, forbidden, jsonError, jsonOk } from "@/lib/server/errors";
import { listMembers } from "@/lib/server/orders";
import { createMemberSchema, parseBody } from "@/lib/server/validators";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireUser();
    const members = await listMembers(user.buildingId);
    return jsonOk({ members });
  } catch (error) {
    return jsonError(error);
  }
}

// 팀원 등록 — 소장만. 같은 빌딩 소속 시설팀(tech) 계정을 만든다.
export async function POST(request: Request) {
  try {
    const me = await requireUser();
    if (me.role !== "manager") throw forbidden("팀원 등록은 관리소장만 할 수 있습니다.");

    const raw = await request.json().catch(() => null);
    const body = parseBody(createMemberSchema, raw);

    try {
      const created = await prisma.user.create({
        data: {
          buildingId: me.buildingId,
          email: body.email,
          passwordHash: await hashPassword(body.password),
          name: body.name,
          role: Role.tech,
          title: body.title,
          phone: body.phone,
          years: body.years,
          specialties: body.specialties,
        },
      });
      return jsonOk(
        {
          member: {
            id: created.id,
            name: created.name,
            role: created.role,
            title: created.title,
            specialty: created.specialties,
            phone: created.phone,
            years: created.years,
            email: created.email,
          },
        },
        201
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw badRequest("이미 가입된 이메일입니다.", "EMAIL_TAKEN");
      }
      throw error;
    }
  } catch (error) {
    return jsonError(error);
  }
}
