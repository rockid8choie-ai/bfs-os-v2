import { cookies } from "next/headers";
import { SESSION_COOKIE, cookieOptions } from "@/lib/server/auth";
import { jsonOk } from "@/lib/server/errors";

export const runtime = "nodejs";

export async function POST() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  return jsonOk({ ok: true });
}
