import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { authorizeUrl, isProvider, providerEnabled } from "@/lib/server/oauth";

export const runtime = "nodejs";

const STATE_COOKIE = "bfs_oauth_state";

// 소셜 로그인 시작 — state 쿠키를 심고 제공자 인가 화면으로 보낸다.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const origin = new URL(request.url).origin;

  if (!isProvider(provider) || !providerEnabled(provider)) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("지원하지 않는 로그인 방식입니다.")}`
    );
  }

  const state = randomBytes(16).toString("hex");
  const redirectUri = `${origin}/api/auth/oauth/${provider}/callback`;
  const res = NextResponse.redirect(authorizeUrl(provider, redirectUri, state));
  res.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  return res;
}
