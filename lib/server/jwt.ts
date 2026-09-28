import { SignJWT, jwtVerify } from "jose";

export type JwtRole = "manager" | "tech";

export type JwtPayload = {
  sub: string;
  role: JwtRole;
  buildingId: string;
  email: string;
};

export function jwtSecret() {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(value);
}

export async function signToken(user: {
  id: string;
  role: JwtRole;
  buildingId: string;
  email: string;
}) {
  return new SignJWT({
    role: user.role,
    buildingId: user.buildingId,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN ?? "7d")
    .sign(jwtSecret());
}

// 비밀번호 재설정 토큰 — 30분 단기, 현재 해시 끝자락을 넣어 비번이 바뀌면 자동 무효(1회용 효과)
export async function signResetToken(userId: string, passwordHash: string | null) {
  return new SignJWT({ purpose: "pw-reset", ph: (passwordHash ?? "").slice(-10) })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(jwtSecret());
}

export async function verifyResetToken(
  token: string
): Promise<{ userId: string; ph: string } | null> {
  try {
    const { payload } = await jwtVerify(token, jwtSecret());
    if (payload.purpose !== "pw-reset" || !payload.sub) return null;
    return { userId: payload.sub, ph: String(payload.ph ?? "") };
  } catch {
    return null;
  }
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    if (!process.env.JWT_SECRET) return null;
    const { payload } = await jwtVerify(token, jwtSecret());
    if (!payload.sub || !payload.role || !payload.buildingId || !payload.email) {
      return null;
    }
    return {
      sub: payload.sub,
      role: payload.role as JwtRole,
      buildingId: String(payload.buildingId),
      email: String(payload.email),
    };
  } catch {
    return null;
  }
}
