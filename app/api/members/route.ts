import { requireUser } from "@/lib/server/auth";
import { jsonError, jsonOk } from "@/lib/server/errors";
import { listMembers } from "@/lib/server/orders";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireUser();
    const members = await listMembers(user.buildingId);
    return jsonOk({ members });
  } catch (error) {
    return jsonError(error);
  }
}
