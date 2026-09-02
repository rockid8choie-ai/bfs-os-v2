import { requireUser } from "@/lib/server/auth";
import { jsonError, jsonOk } from "@/lib/server/errors";
import { advanceOrder, assignOrder } from "@/lib/server/orders";
import { parseBody, patchOrderSchema } from "@/lib/server/validators";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await context.params;
    const body = parseBody(patchOrderSchema, await request.json());

    const order =
      body.action === "assign"
        ? await assignOrder(user, id, body.assigneeId)
        : await advanceOrder(user, id);

    return jsonOk({ order });
  } catch (error) {
    return jsonError(error);
  }
}
