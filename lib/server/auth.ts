import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";
import { prisma } from "./db";
import { unauthorized } from "./errors";
import { SESSION_COOKIE } from "./auth-cookie";
import { signToken, verifyToken } from "./jwt";

export { signToken, verifyToken, SESSION_COOKIE };

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  title: string;
  phone: string;
  years: number;
  specialty: string[];
  buildingId: string;
  buildingName: string;
  hasPassword: boolean;
};

type DbUserWithBuilding = {
  id: string;
  email: string;
  passwordHash: string | null;
  name: string;
  role: Role;
  title: string;
  phone: string;
  years: number;
  specialties: string[];
  buildingId: string;
  building: { name: string };
};

export function toSession(user: DbUserWithBuilding): SessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    title: user.title,
    phone: user.phone,
    years: user.years,
    specialty: user.specialties,
    buildingId: user.buildingId,
    buildingName: user.building.name,
    hasPassword: Boolean(user.passwordHash),
  };
}

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export function cookieOptions() {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function requireUser(): Promise<SessionUser> {
  const jar = await cookies();
  const fromCookie = jar.get(SESSION_COOKIE)?.value;
  if (!fromCookie) throw unauthorized();

  const payload = await verifyToken(fromCookie);
  if (!payload) throw unauthorized("세션이 만료되었습니다. 다시 로그인해 주세요.");

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    include: { building: true },
  });
  if (!user) throw unauthorized("계정을 찾을 수 없습니다.");

  return toSession(user);
}

export function toPublicUser(user: SessionUser) {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    title: user.title,
    specialty: user.specialty,
    phone: user.phone,
    years: user.years,
    buildingId: user.buildingId,
    buildingName: user.buildingName,
    email: user.email,
    hasPassword: user.hasPassword,
  };
}

// 세션 쿠키 발급까지 한 번에 — 로그인·가입·소셜 콜백 공용.
export async function establishSession(user: DbUserWithBuilding) {
  const token = await signToken({
    id: user.id,
    role: user.role,
    buildingId: user.buildingId,
    email: user.email,
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, cookieOptions());
  return { token, user: toPublicUser(toSession(user)) };
}
