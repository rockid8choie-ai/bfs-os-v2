"use client";

import AssignSheet from "@/components/AssignSheet";
import MemberSheet from "@/components/MemberSheet";

/** 전역 시트 호스트 — 어느 화면에서 열든 같은 위치·같은 모션으로 뜬다 */
export default function Sheets() {
  return (
    <>
      <AssignSheet />
      <MemberSheet />
    </>
  );
}
