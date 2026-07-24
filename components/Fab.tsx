"use client";

import { useState } from "react";

type Route = { type: string; icon: string; reason: string };

// 베타: 키워드 규칙으로 AI 분류를 시뮬레이션 (실서비스에서는 코파일럿 API 연결)
function classify(text: string): Route {
  const t = text.trim();
  if (/(누수|물|배관|화장실|온수)/.test(t))
    return { type: "작업지시 · 배관", icon: "🔧", reason: "설비 조치가 필요한 내용으로 판단" };
  if (/(불만|시끄|냄새|요청|문의|불편)/.test(t))
    return { type: "민원 · 입주사 응대", icon: "💬", reason: "입주사 커뮤니케이션 사안으로 판단" };
  if (/(고장|정지|알람|경보|화재|정전)/.test(t))
    return { type: "긴급 이슈", icon: "🚨", reason: "즉시 대응이 필요한 이상 상황으로 판단" };
  return { type: "작업지시 · 일반", icon: "🔧", reason: "현장 조치 사항으로 판단" };
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
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-30 mx-auto flex w-full max-w-md justify-end px-4">
        <button
          aria-label="접수하기"
          onClick={() => setOpen(true)}
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-3xl font-light text-white shadow-lg shadow-brand/40"
        >
          ＋
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50" onClick={reset}>
          <div
            className="w-full max-w-md rounded-t-2xl bg-card p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            {!done ? (
              <>
                <h2 className="text-lg font-bold">무엇이든 접수</h2>
                <p className="mt-1 text-sm text-sub">
                  사진 찍고 한 줄만 쓰면, 이슈·민원·작업 분류는 AI가 합니다.
                </p>
                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line py-6 text-sm text-sub">
                  📷 사진 추가 (베타에서는 생략 가능)
                </button>
                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setRoute(e.target.value.trim() ? classify(e.target.value) : null);
                  }}
                  placeholder="예) 3층 화장실 온수가 안 나와요"
                  rows={2}
                  className="mt-3 w-full rounded-xl border border-line p-3 text-[15px] outline-none focus:border-brand"
                />
                {route && (
                  <div className="mt-3 rounded-xl bg-page p-3 text-sm">
                    <span className="font-bold text-brand">
                      {route.icon} {route.type}
                    </span>
                    로 접수됩니다 · <span className="text-sub">{route.reason}</span>
                  </div>
                )}
                <button
                  disabled={!route}
                  onClick={() => setDone(true)}
                  className="mt-4 w-full rounded-xl bg-brand py-3.5 font-bold text-white disabled:opacity-30"
                >
                  접수하기
                </button>
              </>
            ) : (
              <div className="py-6 text-center">
                <div className="text-4xl">✅</div>
                <h2 className="mt-3 text-lg font-bold">접수 완료</h2>
                <p className="mt-1 text-sm text-sub">
                  {route?.icon} {route?.type}로 등록됐습니다.
                  <br />
                  담당자 배정과 알림은 자동으로 처리됩니다.
                </p>
                <button
                  onClick={reset}
                  className="mt-5 w-full rounded-xl bg-brand py-3.5 font-bold text-white"
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
