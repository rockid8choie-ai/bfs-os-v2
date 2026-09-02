import type { User } from "@prisma/client";
import { prisma } from "./db";
import { recommend } from "@/lib/assign";
import { mapWorkOrder, statusToUi } from "./map";
import { badRequest, forbidden, notFound } from "./errors";
import type { SessionUser } from "./auth";
import type { Member, Priority, Specialty, WorkOrder as UiWorkOrder } from "@/lib/mock";

function toMember(user: Pick<User, "id" | "name" | "role" | "title" | "phone" | "years" | "specialties">): Member {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    title: user.title,
    specialty: user.specialties as Specialty[],
    phone: user.phone,
    years: user.years,
  };
}

export async function listOrdersFor(user: SessionUser) {
  const rows = await prisma.workOrder.findMany({
    where: {
      buildingId: user.buildingId,
      ...(user.role === "tech" ? { assigneeId: user.id } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapWorkOrder);
}

export async function listMembers(buildingId: string) {
  const [users, orders] = await Promise.all([
    prisma.user.findMany({
      where: { buildingId },
      orderBy: { createdAt: "asc" },
    }),
    prisma.workOrder.findMany({
      where: { buildingId },
      select: { assigneeId: true, status: true },
    }),
  ]);

  return users.map((u) => {
    const mine = orders.filter((o) => o.assigneeId === u.id);
    return {
      ...toMember(u),
      load: mine.filter((o) => o.status === "assigned" || o.status === "in_progress").length,
      doneToday: mine.filter((o) => o.status === "done").length,
    };
  });
}

export async function recommendAssignee(
  buildingId: string,
  specialty?: string | null,
  priority: Priority = "보통"
) {
  const [users, orders] = await Promise.all([
    prisma.user.findMany({ where: { buildingId } }),
    prisma.workOrder.findMany({ where: { buildingId } }),
  ]);
  const members = users.map(toMember);
  const uiOrders: UiWorkOrder[] = orders.map((o) => ({
    id: o.id,
    title: o.title,
    location: o.location,
    due: o.due,
    status: statusToUi(o.status),
    priority: "보통",
    source: o.source,
    assigneeId: o.assigneeId ?? undefined,
    specialty: (o.specialty as Specialty) ?? undefined,
  }));
  return recommend(members, uiOrders, (specialty as Specialty) ?? undefined, priority);
}

export async function assignOrder(
  user: SessionUser,
  orderId: string,
  assigneeId: string
) {
  if (user.role !== "manager" && assigneeId !== user.id) {
    throw forbidden("자신의 작업으로만 가져올 수 있습니다.");
  }

  const order = await prisma.workOrder.findFirst({
    where: { id: orderId, buildingId: user.buildingId },
  });
  if (!order) throw notFound("작업을 찾을 수 없습니다.");

  const assignee = await prisma.user.findFirst({
    where: { id: assigneeId, buildingId: user.buildingId },
  });
  if (!assignee) throw badRequest("해당 건물의 담당자가 아닙니다.");

  const nextStatus = order.status === "done" ? "done" : "assigned";

  const [updated] = await prisma.$transaction([
    prisma.workOrder.update({
      where: { id: order.id },
      data: {
        assigneeId: assignee.id,
        assignedById: user.id,
        assignedAt: new Date(),
        status: nextStatus,
      },
    }),
    prisma.assignmentEvent.create({
      data: {
        workOrderId: order.id,
        assigneeId: assignee.id,
        assignedById: user.id,
      },
    }),
  ]);

  return mapWorkOrder(updated);
}

export async function advanceOrder(user: SessionUser, orderId: string) {
  const order = await prisma.workOrder.findFirst({
    where: { id: orderId, buildingId: user.buildingId },
  });
  if (!order) throw notFound("작업을 찾을 수 없습니다.");

  if (user.role === "tech" && order.assigneeId !== user.id) {
    throw forbidden("배정받은 작업만 처리할 수 있습니다.");
  }

  if (order.status === "pending") {
    throw badRequest("담당자를 먼저 배정해야 시작할 수 있습니다.");
  }
  if (order.status === "done") {
    throw badRequest("이미 완료된 작업입니다.");
  }

  if (order.status === "assigned") {
    const updated = await prisma.workOrder.update({
      where: { id: order.id },
      data: { status: "in_progress" },
    });
    return mapWorkOrder(updated);
  }

  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.workOrder.update({
      where: { id: order.id },
      data: { status: "done" },
    });
    if (order.vocId) {
      await tx.voc.update({
        where: { id: order.vocId },
        data: { status: "done" },
      });
    }
    return next;
  });

  return mapWorkOrder(updated);
}
