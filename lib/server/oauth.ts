import { SignJWT, jwtVerify } from "jose";
import { jwtSecret } from "./jwt";
import { ApiError, badRequest } from "./errors";

// 소셜 로그인 제공자 — env에 클라이언트 키가 있는 것만 활성화된다.
// 리다이렉트 URI는 콘솔에 `{origin}/api/auth/oauth/{provider}/callback`으로 등록.

export type Provider = "kakao" | "google" | "naver";

export type SocialProfile = {
  provider: Provider;
  providerUserId: string;
  email: string | null;
  name: string | null;
};

type ProviderConfig = {
  clientId: string | undefined;
  clientSecret: string | undefined;
  authorizeUrl: string;
  tokenUrl: string;
  scope: string;
  secretRequired: boolean;
};

const CONFIGS: Record<Provider, ProviderConfig> = {
  kakao: {
    clientId: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET, // 카카오는 선택
    authorizeUrl: "https://kauth.kakao.com/oauth/authorize",
    tokenUrl: "https://kauth.kakao.com/oauth/token",
    scope: "profile_nickname account_email",
    secretRequired: false,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scope: "openid email profile",
    secretRequired: true,
  },
  naver: {
    clientId: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
    authorizeUrl: "https://nid.naver.com/oauth2.0/authorize",
    tokenUrl: "https://nid.naver.com/oauth2.0/token",
    scope: "",
    secretRequired: true,
  },
};

export function isProvider(value: string): value is Provider {
  return value === "kakao" || value === "google" || value === "naver";
}

export function enabledProviders(): Provider[] {
  return (Object.keys(CONFIGS) as Provider[]).filter((p) => {
    const c = CONFIGS[p];
    return Boolean(c.clientId) && (!c.secretRequired || Boolean(c.clientSecret));
  });
}

export function providerEnabled(provider: Provider) {
  return enabledProviders().includes(provider);
}

export function authorizeUrl(provider: Provider, redirectUri: string, state: string) {
  const c = CONFIGS[provider];
  const params = new URLSearchParams({
    client_id: c.clientId ?? "",
    redirect_uri: redirectUri,
    response_type: "code",
    state,
  });
  if (c.scope) params.set("scope", c.scope);
  return `${c.authorizeUrl}?${params.toString()}`;
}

async function exchangeCode(provider: Provider, redirectUri: string, code: string) {
  const c = CONFIGS[provider];
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: c.clientId ?? "",
    redirect_uri: redirectUri,
    code,
  });
  if (c.clientSecret) body.set("client_secret", c.clientSecret);

  const res = await fetch(c.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  const json = (await res.json().catch(() => null)) as
    | { access_token?: string; error?: string; error_description?: string }
    | null;
  if (!res.ok || !json?.access_token) {
    throw badRequest(
      json?.error_description ?? "소셜 로그인 토큰 발급에 실패했습니다.",
      "OAUTH_TOKEN"
    );
  }
  return json.access_token;
}

async function fetchProfile(provider: Provider, accessToken: string): Promise<SocialProfile> {
  const auth = { Authorization: `Bearer ${accessToken}` };

  if (provider === "kakao") {
    const res = await fetch("https://kapi.kakao.com/v2/user/me", { headers: auth });
    const j = (await res.json().catch(() => null)) as {
      id?: number;
      kakao_account?: { email?: string; profile?: { nickname?: string } };
    } | null;
    if (!res.ok || !j?.id) throw badRequest("카카오 프로필 조회에 실패했습니다.", "OAUTH_PROFILE");
    return {
      provider,
      providerUserId: String(j.id),
      email: j.kakao_account?.email ?? null,
      name: j.kakao_account?.profile?.nickname ?? null,
    };
  }

  if (provider === "google") {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", { headers: auth });
    const j = (await res.json().catch(() => null)) as {
      sub?: string;
      email?: string;
      name?: string;
    } | null;
    if (!res.ok || !j?.sub) throw badRequest("구글 프로필 조회에 실패했습니다.", "OAUTH_PROFILE");
    return { provider, providerUserId: j.sub, email: j.email ?? null, name: j.name ?? null };
  }

  const res = await fetch("https://openapi.naver.com/v1/nid/me", { headers: auth });
  const j = (await res.json().catch(() => null)) as {
    response?: { id?: string; email?: string; name?: string; nickname?: string };
  } | null;
  if (!res.ok || !j?.response?.id) {
    throw badRequest("네이버 프로필 조회에 실패했습니다.", "OAUTH_PROFILE");
  }
  return {
    provider,
    providerUserId: j.response.id,
    email: j.response.email ?? null,
    name: j.response.name ?? j.response.nickname ?? null,
  };
}

export async function resolveProfile(provider: Provider, redirectUri: string, code: string) {
  try {
    const token = await exchangeCode(provider, redirectUri, code);
    return await fetchProfile(provider, token);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw badRequest("소셜 로그인 처리 중 오류가 발생했습니다.", "OAUTH_FAILED");
  }
}

// 신규 소셜 유저의 가입 완료(빌딩 이름 입력) 전까지 프로필을 담아두는 단기 토큰.
export async function signPendingToken(profile: SocialProfile) {
  return new SignJWT({
    purpose: "social-signup",
    provider: profile.provider,
    providerUserId: profile.providerUserId,
    email: profile.email,
    name: profile.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(jwtSecret());
}

export async function verifyPendingToken(token: string): Promise<SocialProfile> {
  try {
    const { payload } = await jwtVerify(token, jwtSecret());
    if (payload.purpose !== "social-signup" || !payload.provider || !payload.providerUserId) {
      throw new Error("bad token");
    }
    return {
      provider: payload.provider as Provider,
      providerUserId: String(payload.providerUserId),
      email: (payload.email as string | null) ?? null,
      name: (payload.name as string | null) ?? null,
    };
  } catch {
    throw badRequest("가입 세션이 만료되었습니다. 다시 로그인해 주세요.", "OAUTH_PENDING_EXPIRED");
  }
}
