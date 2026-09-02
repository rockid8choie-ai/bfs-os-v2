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
};

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
  };
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
  };
}
