import type { Priority, VocStatus, WoStatus, WorkOrder } from "@prisma/client";
import type {
  Priority as UiPriority,
  Voc,
  WoStatus as UiStatus,
  WorkOrder as UiWorkOrder,
} from "@/lib/mock";

const STATUS_TO_UI: Record<WoStatus, UiStatus> = {
  pending: "대기",
  assigned: "배정됨",
  in_progress: "진행중",
  done: "완료",
};

const PRIORITY_TO_UI: Record<Priority, UiPriority> = {
  urgent: "긴급",
  high: "높음",
  normal: "보통",
};

const VOC_TO_UI: Record<VocStatus, Voc["status"]> = {
  received: "접수",
  processing: "처리중",
  done: "완료",
};

const STATUS_FROM_UI: Record<UiStatus, WoStatus> = {
  대기: "pending",
  배정됨: "assigned",
  진행중: "in_progress",
  완료: "done",
};

const PRIORITY_FROM_UI: Record<UiPriority, Priority> = {
  긴급: "urgent",
  높음: "high",
  보통: "normal",
};

export function statusToUi(status: WoStatus): UiStatus {
  return STATUS_TO_UI[status];
}

export function statusFromUi(status: UiStatus): WoStatus {
  return STATUS_FROM_UI[status];
}

export function priorityToUi(priority: Priority): UiPriority {
  return PRIORITY_TO_UI[priority];
}

export function priorityFromUi(priority: UiPriority): Priority {
  return PRIORITY_FROM_UI[priority];
}

export function formatRelativeStamp(date: Date) {
  const now = new Date();
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startThat = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((startToday.getTime() - startThat.getTime()) / 86400000);

  if (diffDays === 0) return `오늘 ${hh}:${mm}`;
  if (diffDays === 1) return `어제 ${hh}:${mm}`;
  return `${date.getMonth() + 1}/${date.getDate()} ${hh}:${mm}`;
}

export function mapWorkOrder(row: WorkOrder): UiWorkOrder {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    due: row.due,
    status: statusToUi(row.status),
    priority: priorityToUi(row.priority),
    source: row.source,
    specialty: (row.specialty as UiWorkOrder["specialty"]) ?? undefined,
    assigneeId: row.assigneeId ?? undefined,
    assignedBy: row.assignedById ?? undefined,
    assignedAt: row.assignedAt ? formatRelativeStamp(row.assignedAt) : undefined,
    vocId: row.vocId ?? undefined,
  };
}

export function mapVoc(row: {
  id: string;
  title: string;
  tenant: string;
  status: VocStatus;
  aiTag: string;
  specialty: string | null;
  createdAt: Date;
  workOrder?: { id: string } | null;
}): Voc {
  return {
    id: row.id,
    title: row.title,
    tenant: row.tenant,
    createdAt: formatRelativeStamp(row.createdAt),
    status: VOC_TO_UI[row.status],
    aiTag: row.aiTag,
    specialty: (row.specialty as Voc["specialty"]) ?? undefined,
    workOrderId: row.workOrder?.id,
  };
}
