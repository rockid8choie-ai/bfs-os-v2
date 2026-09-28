import { prisma } from "@/lib/server/db";
import { signResetToken } from "@/lib/server/jwt";
import { mailerConfigured, sendMail } from "@/lib/server/mailer";
import { ApiError, jsonError, jsonOk } from "@/lib/server/errors";
import { parseBody, resetRequestSchema } from "@/lib/server/validators";

export const runtime = "nodejs";

// 비밀번호 재설정 링크 발송.
// 계정 존재 여부와 무관하게 성공으로 응답한다(이메일 존재 탐지 방지).
export async function POST(request: Request) {
  try {
    const raw = await request.json().catch(() => null);
    const body = parseBody(resetRequestSchema, raw);

    if (!mailerConfigured()) {
      throw new ApiError(
        503,
        "MAIL_NOT_CONFIGURED",
        "이메일 발송이 아직 설정되지 않았습니다. 관리자에게 문의해 주세요."
      );
    }

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (user) {
      const token = await signResetToken(user.id, user.passwordHash);
      const origin = new URL(request.url).origin;
      const link = `${origin}/reset/confirm?token=${encodeURIComponent(token)}`;
      await sendMail(
        user.email,
        "BFS OS 비밀번호 재설정",
        `<div style="font-family:sans-serif;line-height:1.6">
          <p>${user.name}님, 비밀번호 재설정 요청을 받았어요.</p>
          <p><a href="${link}" style="display:inline-block;background:#3182f6;color:#fff;padding:12px 20px;border-radius:12px;text-decoration:none;font-weight:bold">새 비밀번호 만들기</a></p>
          <p style="color:#6b7684;font-size:13px">링크는 30분간 유효합니다. 요청한 적이 없다면 이 메일은 무시하세요.</p>
        </div>`
      );
    }

    return jsonOk({ sent: true });
  } catch (error) {
    return jsonError(error);
  }
}
