"use client";

import Avatar from "@/components/Avatar";
import { ChevronIcon, UserIcon } from "@/components/icons";
import { useApp } from "@/lib/store";
import type { WorkOrder } from "@/lib/mock";

/**
 * 작업 카드의 담당자 줄.
 * 배정된 담당자를 누르면 프로필 시트가 그 자리에서 열리고, 거기서 바로 재배정까지 이어진다.
 * (v1은 배정과 프로필 조회가 다른 화면으로 흩어져 흐름이 끊겼다)
 */
export default function AssigneeRow({ order }: { order: WorkOrder }) {
  const { memberById, loadOf, openAssign, openMember, role } = useApp();
  const assignee = memberById(order.assigneeId);

  if (!assignee) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-danger-soft px-3 py-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-page text-danger">
          <UserIcon className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <span className="flex-1 text-[13px] font-bold text-danger">담당 미지정</span>
        {role === "manager" && (
          <button
            onClick={() => openAssign(order.id)}
            className="rounded-lg bg-danger px-3 py-1.5 text-[12px] font-bold text-white transition-transform active:scale-95"
          >
            담당 지정
          </button>
        )}
      </div>
    );
  }

  const load = loadOf(assignee.id);

  return (
    <button
      onClick={() => openMember(assignee.id, order.id)}
      className="mt-3 flex w-full items-center gap-2.5 rounded-xl bg-elev px-3 py-2.5 text-left transition-transform active:scale-[0.99]"
    >
      <Avatar member={assignee} size={28} />
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-bold leading-tight">
          {assignee.name}
          <span className="ml-1.5 font-medium text-sub">{assignee.title}</span>
        </span>
        <span className="mt-0.5 block text-[11px] text-sub">
          {order.assignedAt ? `${order.assignedAt} 배정` : "배정됨"} · 진행중 {load}건
        </span>
      </span>
      <ChevronIcon className="h-4 w-4 shrink-0 text-mute" strokeWidth={2.4} />
    </button>
  );
}
