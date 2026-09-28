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
        "[BFS OS] 비밀번호 재설정 안내",
        `<div style="background:#f7f8fa;padding:32px 16px;font-family:-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif">
          <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px 28px">
            <div style="font-size:20px;font-weight:800;letter-spacing:-0.5px;color:#191f28">BFS <span style="color:#3182f6">OS</span></div>
            <p style="margin:20px 0 6px;font-size:16px;font-weight:700;color:#191f28">${user.name}님, 비밀번호 재설정 요청을 받았습니다</p>
            <p style="margin:0 0 22px;font-size:14px;line-height:1.7;color:#4e5968">아래 버튼을 눌러 새 비밀번호를 만들어 주세요.<br/>링크는 <b>30분간</b> 유효합니다.</p>
            <a href="${link}" style="display:block;background:#3182f6;color:#ffffff;text-align:center;padding:14px 0;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px">새 비밀번호 만들기</a>
            <p style="margin:22px 0 0;font-size:12px;line-height:1.7;color:#8b95a1">본인이 요청하지 않았다면 이 메일을 무시하셔도 됩니다 — 비밀번호는 바뀌지 않습니다.<br/>버튼이 안 눌리면 이 주소를 브라우저에 붙여넣으세요:<br/><span style="color:#4e5968;word-break:break-all">${link}</span></p>
          </div>
          <p style="max-width:480px;margin:14px auto 0;text-align:center;font-size:11px;color:#8b95a1">BFS OS · 빌딩 시설 운영</p>
        </div>`
      );
    }

    return jsonOk({ sent: true });
  } catch (error) {
    return jsonError(error);
  }
}
