// BFS OS → BFS 매치 브릿지.
//
// 내부 인력으로 처리할 수 없는 작업을 외주 견적 요청으로 넘긴다.
// 동시에 두 앱을 합칠지 판단하는 측정 장치다 — "소장이 OS를 쓰다가
// 실제로 외주를 보내는가"를 outsource_clicked / 매치의 request_created로 센다.
// 전환이 확인되면 코드를 합치고, 안 되면 합쳐도 안 쓰이는 것이므로 합치지 않는다.
//
// 네이티브 셸에서는 capacitor.config.json의 allowNavigation이
// bfs-os-v2.vercel.app만 허용하므로, 매치 링크는 시스템 브라우저로 열린다.
import type { WorkOrder } from "@/lib/mock";

export const MATCH_URL = (
  process.env.NEXT_PUBLIC_MATCH_URL || "https://bfs-match.vercel.app"
).replace(/\/+$/, "");

type OutsourceSource = Pick<WorkOrder, "title" | "location" | "priority" | "specialty">;

/** 작업 한 건 → 매치 요청 입력창에 그대로 들어갈 한 줄 */
export function outsourceText(o: Pick<WorkOrder, "title" | "location" | "priority">) {
  const title = o.title.trim();
  // 위치 토큰 중 제목에 이미 나온 건 뺀다 ("3F 302호" + "302호 천장 누수" → "3F 302호 천장 누수")
  const loc = (o.location ?? "")
    .trim()
    .split(/\s+/)
    .filter((t) => t && !title.includes(t))
    .join(" ");
  const tail = o.priority === "긴급" ? " (긴급)" : "";
  return `${loc ? `${loc} ` : ""}${title}${tail}`.trim();
}

/** 매치 요청 작성 화면 딥링크 — 내용·공종이 채워진 상태로 열린다 */
export function outsourceLink(o: OutsourceSource) {
  const p = new URLSearchParams({
    req: outsourceText(o),
    // 유입 분석에서 브릿지 경유를 채널로 분리해 본다
    utm_source: "bfs_os",
    utm_medium: "bridge",
    utm_campaign: "os_outsource",
  });
  // OS가 이미 분류한 공종을 그대로 넘긴다 — 매치에서 다시 추측하지 않게
  if (o.specialty) p.set("trade", o.specialty);
  return `${MATCH_URL}/?${p.toString()}`;
}
