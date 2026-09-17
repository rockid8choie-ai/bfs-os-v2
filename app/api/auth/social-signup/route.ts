import { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/server/db";
import { establishSession } from "@/lib/server/auth";
import { badRequest, jsonError, jsonOk } from "@/lib/server/errors";
import { verifyPendingToken } from "@/lib/server/oauth";
import { parseBody, socialSignupSchema } from "@/lib/server/validators";

export const runtime = "nodejs";

// 소셜 신규 가입 완료 — 빌딩 이름을 받아 빌딩+소장 계정을 만들고 소셜 계정을 연결한다.
export async function POST(request: Request) {
  try {
    const raw = await request.json().catch(() => null);
    const body = parseBody(socialSignupSchema, raw);
    const profile = await verifyPendingToken(body.token);

    // 이메일 미제공(동의 안 함) 제공자는 내부 식별용 주소를 만든다.
    const email =
      profile.email?.toLowerCase() ??
      `${profile.provider}-${profile.providerUserId}@social.bfs.local`;
    const name = body.name ?? profile.name ?? "소장님";

    let user;
    try {
      user = await prisma.$transaction(async (tx) => {
        const building = await tx.building.create({ data: { name: body.buildingName } });
        const created = await tx.user.create({
          data: {
            buildingId: building.id,
            email,
            passwordHash: null,
            name,
            role: Role.manager,
            title: "관리소장",
            phone: "",
            years: 0,
            specialties: [],
          },
          include: { building: true },
        });
        await tx.oAuthAccount.create({
          data: {
            provider: profile.provider,
            providerUserId: profile.providerUserId,
            userId: created.id,
          },
        });
        return created;
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw badRequest("이미 가입된 계정입니다. 로그인 화면에서 소셜 버튼으로 로그인해 주세요.", "ALREADY_LINKED");
      }
      throw error;
    }

    return jsonOk(await establishSession(user), 201);
  } catch (error) {
    return jsonError(error);
  }
}
