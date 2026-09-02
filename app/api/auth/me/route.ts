import { requireUser, toPublicUser } from "@/lib/server/auth";
import { jsonError, jsonOk } from "@/lib/server/errors";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireUser();
    return jsonOk({ user: toPublicUser(user) });
  } catch (error) {
    return jsonError(error);
  }
}
