"use client";

import Link from "next/link";
import Avatar from "@/components/Avatar";
import PipelineStrip from "@/components/PipelineStrip";
import {
  AlertIcon,
  CalendarCheckIcon,
  ChevronIcon,
  MessageIcon,
  WrenchIcon,
} from "@/components/icons";
import { BUILDING } from "@/lib/mock";
import { useApp } from "@/lib/store";

type Tile = { Icon: (p: { className?: string; strokeWidth?: number }) => React.ReactNode; tile: string };

const KIND_STYLE: Record<string, Tile> = {
  alarm: { Icon: AlertIcon, tile: "bg-elev text-danger" },
  voc: { Icon: MessageIcon, tile: "bg-brand-soft text-brand" },
  work: { Icon: WrenchIcon, tile: "bg-tint-amber text-tint-amber-fg" },
  inspection: { Icon: CalendarCheckIcon, tile: "bg-tint-emerald text-tint-emerald-fg" },
};

function Sparkline({ data }: { data: readonly number[] }) {
  const max = Math.max(...data);
  return (
    <svg viewBox={`0 0 ${data.length * 10 - 4} 32`} className="h-8 w-20">
      {data.map((v, i) => {
        const h = Math.max(4, (v / max) * 32);
        const last = i === data.length - 1;
        return (
          <rect
            key={i}
            x={i * 10}
            y={32 - h}
            width="6"
            height={h}
            rx="3"
            fill={last ? "#3182f6" : "rgba(255,255,255,0.22)"}
          />
        );
      })}
    </svg>
  );
}

export default function Home() {
  const {
    role,
    me,
    orders,
    vocs,
    visibleOrders,
    openAssign,
    openMember,
    memberById,
    savedHours,
    autoAssigned,
  } = useApp();

  const unassigned = orders.filter((o) => !o.assigneeId && o.status !== "완료");
  const newVocs = vocs.filter((v) => v.status === "접수");
  const running = visibleOrders.filter((o) => o.status === "진행중");
  const myTodo = visibleOrders.filter(
    (o) => o.status === "배정됨" || o.status === "진행중"
  );
  const todayCount = role === "manager" ? unassigned.length + running.length : myTodo.length;

  type FeedItem = {
    id: string;
    kind: keyof typeof KIND_STYLE;
    title: string;
    detail: string;
    urgent?: boolean;
    cta: string;
    href?: string;
    onClick?: () => void;
    assigneeId?: string;
  };

  const feed: FeedItem[] =
    role === "manager"
      ? [
          ...unassigned.map<FeedItem>((o) => ({
            id: o.id,
            kind: o.priority === "긴급" ? "alarm" : o.source === "법정 의무" ? "inspection" : "work",
            title: o.title,
            detail: `${o.location} · 마감 ${o.due} · ${o.source} · 담당 미지정`,
            urgent: o.priority === "긴급",
            cta: "담당 지정",
            onClick: () => openAssign(o.id),
          })),
          ...(newVocs.length
            ? [
                {
                  id: "voc",
                  kind: "voc" as const,
                  title: `새 민원 ${newVocs.length}건 — ${newVocs[0].tenant.split(" · ")[0]} 외`,
                  detail: `입주사 포털 접수 · AI 분류: ${newVocs[0].aiTag}`,
                  cta: "민원 보기",
                  href: "/voc",
                },
              ]
            : []),
          ...(running.length
            ? [
                {
                  id: "run",
                  kind: "work" as const,
                  title: `진행중인 작업 ${running.length}건`,
                  detail: running.map((o) => o.title).join(" · "),
                  cta: "작업 보기",
                  href: "/work-orders",
                },
              ]
            : []),
        ]
      : myTodo.map<FeedItem>((o) => ({
          id: o.id,
          kind: o.priority === "긴급" ? "alarm" : "work",
          title: o.title,
          detail: `${o.location} · 마감 ${o.due} · ${o.status}`,
          urgent: o.priority === "긴급",
          cta: o.status === "배정됨" ? "작업 시작" : "진행 상황",
          href: "/work-orders",
          assigneeId: o.assigneeId,
        }));

  return (
    <div>
      <p className="mt-3 text-[13px] font-semibold text-sub">
        {BUILDING.todayLabel} · {BUILDING.name}
      </p>
      <h1 className="mt-1 text-[24px] font-extrabold leading-snug tracking-[-0.02em]">
        {role === "manager"
          ? "좋은 아침입니다, 소장님"
          : `좋은 아침입니다, ${me.name}님`}
      </h1>
      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-full bg-brand-soft px-3 py-1.5 text-[12px] font-bold text-brand">
          {role === "manager" ? "오늘 챙길 일" : "오늘 내 작업"} {todayCount}건
        </span>
        <span className="rounded-full bg-card px-3 py-1.5 text-[12px] font-bold text-ink2">
          이번 주 처리율 {BUILDING.weeklyRate}%
        </span>
      </div>

      <PipelineStrip />

      <div className="mt-6 flex items-baseline justify-between px-1">
        <h2 className="text-[15px] font-bold">지금 처리할 일</h2>
        <span className="text-xs font-semibold text-sub">중요한 순서로 정렬됨</span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        {feed.length === 0 && (
          <div className="rounded-[20px] bg-card px-4 py-8 text-center text-sm text-sub md:col-span-2">
            지금 처리할 일이 없어요
          </div>
        )}

        {feed.map((f, i) => {
          const s = KIND_STYLE[f.kind];
          const assignee = memberById(f.assigneeId);
          return (
            <div
              key={f.id}
              className={`rise flex flex-col rounded-[20px] p-4 ${f.urgent ? "bg-danger-soft" : "bg-card"}`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.tile}`}
                >
                  <s.Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold leading-snug">{f.title}</div>
                  <div className="mt-0.5 line-clamp-2 text-[13px] text-sub">{f.detail}</div>
                </div>
                {assignee && (
                  <button
                    onClick={() => openMember(assignee.id, f.id)}
                    aria-label={`${assignee.name} 프로필`}
                    className="shrink-0 transition-transform active:scale-95"
                  >
                    <Avatar member={assignee} size={28} />
                  </button>
                )}
              </div>

              <div className="mt-auto pt-3.5">
                {f.href ? (
                  <Link
                    href={f.href}
                    className={`flex w-full items-center justify-center gap-0.5 rounded-xl py-3 text-sm font-bold transition-transform active:scale-[0.98] ${
                      f.urgent ? "bg-danger text-white" : "bg-brand-soft text-brand"
                    }`}
                  >
                    {f.cta}
                    <ChevronIcon className="h-4 w-4 opacity-60" strokeWidth={2.6} />
                  </Link>
                ) : (
                  <button
                    onClick={f.onClick}
                    className={`flex w-full items-center justify-center gap-0.5 rounded-xl py-3 text-sm font-bold transition-transform active:scale-[0.98] ${
                      f.urgent ? "bg-danger text-white" : "bg-brand-soft text-brand"
                    }`}
                  >
                    {f.cta}
                    <ChevronIcon className="h-4 w-4 opacity-60" strokeWidth={2.6} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {role === "manager" && (
        <div
          className="rise mt-5 flex items-center justify-between rounded-[20px] bg-gradient-to-br from-[#191f28] to-[#2c3542] px-5 py-4 text-white"
          style={{ animationDelay: `${feed.length * 70}ms` }}
        >
          <div>
            <div className="text-[12px] font-semibold text-white/55">
              이번 주 BFS가 아낀 시간
            </div>
            <div className="mt-0.5 text-[22px] font-extrabold tracking-tight">
              {savedHours}시간
            </div>
            <div className="mt-0.5 text-[11px] text-white/45">
              AI 분류 · 자동 배정 {autoAssigned}건 · 리포트 자동화
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Sparkline data={BUILDING.savedTrend} />
            <span className="text-[10px] font-semibold text-white/45">최근 8주</span>
          </div>
        </div>
      )}

      <p className="mt-7 text-center text-xs text-sub">
        {unassigned.length === 0
          ? "미지정 작업이 없어요. 나머지는 BFS가 지켜보고 있을게요."
          : `담당자 없는 작업이 ${unassigned.length}건 남아 있어요.`}
      </p>
    </div>
  );
}
