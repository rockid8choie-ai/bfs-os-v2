"use client";

import { useState } from "react";
import {
  AlertIcon,
  CameraIcon,
  CheckCircleIcon,
  MessageIcon,
  PlusIcon,
  WrenchIcon,
} from "@/components/icons";

type IconComp = (p: { className?: string; strokeWidth?: number }) => React.ReactNode;
type Route = { type: string; Icon: IconComp; tile: string; reason: string };

// 베타: 키워드 규칙으로 AI 분류를 시뮬레이션 (실서비스에서는 코파일럿 API 연결)
function classify(text: string): Route {
  const t = text.trim();
  if (/(누수|물|배관|화장실|온수)/.test(t))
    return {
      type: "작업지시 · 배관",
      Icon: WrenchIcon,
      tile: "bg-tint-amber text-tint-amber-fg",
      reason: "설비 조치가 필요한 내용으로 판단",
    };
  if (/(불만|시끄|냄새|요청|문의|불편)/.test(t))
    return {
      type: "민원 · 입주사 응대",
      Icon: MessageIcon,
      tile: "bg-brand-soft text-brand",
      reason: "입주사 커뮤니케이션 사안으로 판단",
    };
  if (/(고장|정지|알람|경보|화재|정전)/.test(t))
    return {
      type: "긴급 이슈",
      Icon: AlertIcon,
      tile: "bg-danger-soft text-danger",
      reason: "즉시 대응이 필요한 이상 상황으로 판단",
    };
  return {
    type: "작업지시 · 일반",
    Icon: WrenchIcon,
    tile: "bg-tint-amber text-tint-amber-fg",
    reason: "현장 조치 사항으로 판단",
  };
}

export default function Fab() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [route, setRoute] = useState<Route | null>(null);
  const [done, setDone] = useState(false);

  const reset = () => {
    setOpen(false);
    setText("");
    setRoute(null);
    setDone(false);
  };

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
            className="sheet-up w-full max-w-md rounded-t-3xl bg-page p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            {!done ? (
              <>
                <h2 className="text-lg font-bold">무엇이든 접수</h2>
                <p className="mt-1 text-sm text-sub">
                  사진 찍고 한 줄만 쓰면, 이슈·민원·작업 분류는 AI가 합니다.
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
                  <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-card p-3 text-sm">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${route.tile}`}
                    >
                      <route.Icon className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                    <span>
                      <b className="font-bold text-brand">{route.type}</b>로
                      접수됩니다 · <span className="text-sub">{route.reason}</span>
                    </span>
                  </div>
                )}
                <button
                  disabled={!route}
                  onClick={() => setDone(true)}
                  className="mt-4 w-full rounded-xl bg-brand py-3.5 font-bold text-white transition-transform active:scale-[0.98] disabled:opacity-30"
                >
                  접수하기
                </button>
              </>
            ) : (
              <div className="py-6 text-center">
                <CheckCircleIcon
                  className="mx-auto h-12 w-12 text-brand"
                  strokeWidth={2}
                />
                <h2 className="mt-3 text-lg font-bold">접수 완료</h2>
                <p className="mt-1 text-sm text-sub">
                  {route?.type}로 등록됐습니다.
                  <br />
                  담당자 배정과 알림은 자동으로 처리됩니다.
                </p>
                <button
                  onClick={reset}
                  className="mt-5 w-full rounded-xl bg-brand py-3.5 font-bold text-white transition-transform active:scale-[0.98]"
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
