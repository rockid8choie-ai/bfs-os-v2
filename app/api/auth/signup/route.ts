import { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/server/db";
import { establishSession, hashPassword } from "@/lib/server/auth";
import { badRequest, jsonError, jsonOk } from "@/lib/server/errors";
import { parseBody, signupSchema } from "@/lib/server/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const raw = await request.json().catch(() => null);
    const body = parseBody(signupSchema, raw);

    const passwordHash = await hashPassword(body.password);

    let user;
    try {
      user = await prisma.$transaction(async (tx) => {
        const building = await tx.building.create({ data: { name: body.buildingName } });
        return tx.user.create({
          data: {
            buildingId: building.id,
            email: body.email,
            passwordHash,
            name: body.name,
            role: Role.manager,
            title: "관리소장",
            phone: body.phone,
            years: 0,
            specialties: [],
          },
          include: { building: true },
        });
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw badRequest("이미 가입된 이메일입니다.", "EMAIL_TAKEN");
      }
      throw error;
    }

    return jsonOk(await establishSession(user), 201);
  } catch (error) {
    return jsonError(error);
  }
}
