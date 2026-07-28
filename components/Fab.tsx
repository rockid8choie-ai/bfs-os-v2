"use client";

import { useState } from "react";
import Avatar from "@/components/Avatar";
import {
  AlertIcon,
  CameraIcon,
  CheckCircleIcon,
  MessageIcon,
  PlusIcon,
  SparkIcon,
  WrenchIcon,
} from "@/components/icons";
import { classify, recommend, type Classified } from "@/lib/assign";
import { useApp } from "@/lib/store";

const KIND_STYLE = {
  work: { Icon: WrenchIcon, tile: "bg-tint-amber text-tint-amber-fg" },
  voc: { Icon: MessageIcon, tile: "bg-brand-soft text-brand" },
  issue: { Icon: AlertIcon, tile: "bg-danger-soft text-danger" },
} as const;

export default function Fab() {
  const { members, orders, createOrder, assign, openAssign, me, role } = useApp();

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [route, setRoute] = useState<Classified | null>(null);
  const [result, setResult] = useState<{ orderId: string; assigneeId: string } | null>(
    null
  );

  const reset = () => {
    setOpen(false);
    setText("");
    setRoute(null);
    setResult(null);
  };

  // 접수 전에 미리 계산해 보여주는 추천 — 접수 시점에도 같은 규칙이 적용된다
  const preview =
    route && role === "manager"
      ? recommend(members, orders, route.specialty, route.priority)
      : null;

  const submit = () => {
    if (!route) return;
    const orderId = createOrder({
      title: text.trim(),
      priority: route.priority,
      specialty: route.specialty,
      source: "AI 접수",
    });
    const assigneeId = role === "manager" ? (preview?.member.id ?? me.id) : me.id;
    assign(orderId, assigneeId);
    setResult({ orderId, assigneeId });
  };

  const assignee = members.find((m) => m.id === result?.assigneeId);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-30 mx-auto flex w-full max-w-md justify-end px-4 md:absolute">
        <button
          aria-label="접수하기"
          onClick={() => setOpen(true)}
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-[0_8px_20px_rgba(49,130,246,0.4)] transition-transform active:scale-95"
        >
          <PlusIcon className="h-7 w-7" strokeWidth={2.4} />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center overflow-hidden bg-black/50 md:absolute md:rounded-[38px]"
          onClick={reset}
        >
          <div
            className="sheet-up max-h-[88%] w-full max-w-md overflow-y-auto rounded-t-3xl bg-page p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            {!result ? (
              <>
                <h2 className="text-lg font-bold">무엇이든 접수</h2>
                <p className="mt-1 text-sm text-sub">
                  사진 찍고 한 줄만 쓰면, 분류부터 담당자 배정까지 AI가 합니다.
                </p>
                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-card py-6 text-sm font-semibold text-sub">
                  <CameraIcon className="h-5 w-5" strokeWidth={2} />
                  사진 추가 (베타에서는 생략 가능)
                </button>
                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setRoute(e.target.value.trim() ? classify(e.target.value) : null);
                  }}
                  placeholder="예) 3층 화장실 온수가 안 나와요"
                  rows={2}
                  className="mt-3 w-full rounded-xl border border-line bg-page p-3 text-[15px] outline-none focus:border-brand"
                />

                {route && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2.5 rounded-xl bg-card p-3 text-sm">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${KIND_STYLE[route.kind].tile}`}
                      >
                        {(() => {
                          const I = KIND_STYLE[route.kind].Icon;
                          return <I className="h-4 w-4" strokeWidth={2.2} />;
                        })()}
                      </span>
                      <span className="min-w-0">
                        <b className="font-bold text-brand">{route.label}</b>로 접수 ·{" "}
                        <span className="text-sub">{route.reason}</span>
                      </span>
                    </div>

                    {preview ? (
                      <div className="flex items-center gap-2.5 rounded-xl bg-brand-soft p-3">
                        <Avatar member={preview.member} size={32} />
                        <span className="min-w-0 flex-1 text-sm">
                          <b className="font-bold">{preview.member.name}</b>
                          <span className="text-sub"> {preview.member.title}</span>
                          <span className="mt-0.5 block text-[11.5px] font-semibold text-brand">
                            {preview.reason}
                          </span>
                        </span>
                        <SparkIcon className="h-4 w-4 shrink-0 text-brand" strokeWidth={2.2} />
                      </div>
                    ) : (
                      <div className="rounded-xl bg-card p-3 text-[13px] text-sub">
                        내 작업으로 등록됩니다 · {me.name}
                      </div>
                    )}
                  </div>
                )}

                <button
                  disabled={!route}
                  onClick={submit}
                  className="mt-4 w-full rounded-xl bg-brand py-3.5 font-bold text-white transition-transform active:scale-[0.98] disabled:opacity-30"
                >
                  접수하기
                </button>
              </>
            ) : (
              <div className="py-4 text-center">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-brand" strokeWidth={2} />
                <h2 className="mt-3 text-lg font-bold">접수 완료</h2>
                {assignee && (
                  <>
                    <p className="mt-1 text-sm text-sub">
                      {route?.label}로 등록하고 담당자를 배정했어요.
                    </p>
                    <div className="mt-4 flex items-center gap-3 rounded-2xl bg-card p-3.5 text-left">
                      <Avatar member={assignee} size={40} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-bold">
                          {assignee.name}
                          <span className="ml-1.5 text-[12px] font-medium text-sub">
                            {assignee.title}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-[11.5px] text-sub">
                          알림 발송됨 · 작업 탭에서 확인
                        </span>
                      </span>
                    </div>
                  </>
                )}
                {role === "manager" && (
                  <button
                    onClick={() => {
                      const id = result.orderId;
                      reset();
                      openAssign(id);
                    }}
                    className="mt-3 w-full rounded-xl bg-card py-3 text-sm font-bold text-ink2 transition-transform active:scale-[0.98]"
                  >
                    담당자 변경
                  </button>
                )}
                <button
                  onClick={reset}
                  className="mt-2 w-full rounded-xl bg-brand py-3.5 font-bold text-white transition-transform active:scale-[0.98]"
                >
                  확인
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
