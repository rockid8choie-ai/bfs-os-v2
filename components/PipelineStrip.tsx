"use client";

import { useRouter } from "next/navigation";
import { ChevronIcon } from "@/components/icons";
import { useApp } from "@/lib/store";
import type { WoStatus } from "@/lib/mock";

/**
 * "BFS OS가 뭘 하는 앱인가"를 한 화면에서 설명하는 장치.
 * 접수 → 배정 → 진행 → 완료 파이프라인을 실제 숫자와 함께 보여준다.
 * 설명 문구가 아니라 지금 돌아가는 데이터로 보여주는 게 핵심.
 */
const STAGES: { key: WoStatus; label: string; caption: string }[] = [
  { key: "대기", label: "접수", caption: "담당 미정" },
  { key: "배정됨", label: "배정", caption: "담당자 지정" },
  { key: "진행중", label: "진행", caption: "현장 조치" },
  { key: "완료", label: "완료", caption: "이력 기록" },
];

export default function PipelineStrip() {
  const { counts, setFilter, role } = useApp();
  const router = useRouter();

  const go = (key: WoStatus) => {
    setFilter(key);
    router.push("/work-orders");
  };

  return (
    <div className="rise mt-4 rounded-[20px] bg-card p-4">
      <div className="flex items-baseline justify-between px-0.5">
        <span className="text-[13px] font-bold">
          {role === "manager" ? "빌딩 전체 처리 흐름" : "내 작업 흐름"}
        </span>
        <span className="text-[11px] font-semibold text-sub">탭하면 해당 목록으로</span>
      </div>

      <div className="mt-3 flex items-stretch">
        {STAGES.map((s, i) => (
          <div key={s.key} className="flex flex-1 items-center">
            <button
              onClick={() => go(s.key)}
              className="flex-1 rounded-xl py-1.5 text-center transition-transform active:scale-95"
            >
              <div
                className={`text-[22px] font-extrabold tracking-tight ${
                  s.key === "대기" && counts[s.key] > 0 ? "text-danger" : "text-ink"
                }`}
              >
                {counts[s.key]}
              </div>
              <div className="mt-0.5 text-[12px] font-bold">{s.label}</div>
              <div className="text-[10.5px] text-sub">{s.caption}</div>
            </button>
            {i < STAGES.length - 1 && (
              <ChevronIcon
                className="mx-0.5 h-3.5 w-3.5 shrink-0 text-mute"
                strokeWidth={3}
              />
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 border-t border-page pt-3 text-center text-[11.5px] leading-relaxed text-sub">
        민원·알람·순찰 발견을 <b className="font-bold text-ink2">한 줄로 접수</b>하면,
        AI가 유형을 분류하고 <b className="font-bold text-ink2">담당자까지 배정</b>합니다.
      </p>
    </div>
  );
}
