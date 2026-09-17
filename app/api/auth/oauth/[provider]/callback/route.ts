import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/server/db";
import { cookieOptions, SESSION_COOKIE, signToken } from "@/lib/server/auth";
import { ApiError } from "@/lib/server/errors";
import {
  isProvider,
  providerEnabled,
  resolveProfile,
  signPendingToken,
} from "@/lib/server/oauth";

export const runtime = "nodejs";

const STATE_COOKIE = "bfs_oauth_state";

function loginError(origin: string, message: string) {
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(message)}`);
}

// 소셜 로그인 콜백 — 기존 연결이면 로그인, 같은 이메일이면 자동 연결,
// 완전 신규면 빌딩 이름을 받는 가입 완료 화면으로 보낸다.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const url = new URL(request.url);
  const origin = url.origin;

  if (!isProvider(provider) || !providerEnabled(provider)) {
    return loginError(origin, "지원하지 않는 로그인 방식입니다.");
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = request.cookies.get(STATE_COOKIE)?.value;
  if (!code || !state || !savedState || state !== savedState) {
    return loginError(origin, "로그인 요청이 유효하지 않습니다. 다시 시도해 주세요.");
  }

  try {
    const redirectUri = `${origin}/api/auth/oauth/${provider}/callback`;
    const profile = await resolveProfile(provider, redirectUri, code);

    // 1) 이미 연결된 소셜 계정 → 바로 로그인
    const linked = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider: profile.provider,
          providerUserId: profile.providerUserId,
        },
      },
      include: { user: { include: { building: true } } },
    });

    let sessionUser = linked?.user ?? null;

    // 2) 같은 이메일의 기존 계정 → 소셜 연결 추가 후 로그인
    if (!sessionUser && profile.email) {
      const byEmail = await prisma.user.findUnique({
        where: { email: profile.email.toLowerCase() },
        include: { building: true },
      });
      if (byEmail) {
        await prisma.oAuthAccount.create({
          data: {
            provider: profile.provider,
            providerUserId: profile.providerUserId,
            userId: byEmail.id,
          },
        });
        sessionUser = byEmail;
      }
    }

    if (sessionUser) {
      // 리다이렉트 응답에 세션 쿠키를 직접 싣는다.
      const token = await signToken({
        id: sessionUser.id,
        role: sessionUser.role,
        buildingId: sessionUser.buildingId,
        email: sessionUser.email,
      });
      const res = NextResponse.redirect(`${origin}/`);
      res.cookies.set(SESSION_COOKIE, token, cookieOptions());
      res.cookies.delete(STATE_COOKIE);
      return res;
    }

    // 3) 완전 신규 → 가입 완료(빌딩 이름) 화면으로
    const pending = await signPendingToken(profile);
    const res = NextResponse.redirect(`${origin}/signup/social?token=${pending}`);
    res.cookies.delete(STATE_COOKIE);
    return res;
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "소셜 로그인에 실패했습니다.";
    return loginError(origin, message);
  }
}
