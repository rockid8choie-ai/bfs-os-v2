"use client";

/**
 * GA4 애널리틱스 중앙 헬퍼 — 모든 이벤트는 이 파일을 통해서만 나간다.
 *
 * 원칙
 * - 이벤트명은 EV 상수로만 사용(오타·중복 방지). GA4 권장 이벤트는 공식 이름 그대로.
 * - 개인정보 금지: 이름·이메일·전화·자유입력 텍스트는 어떤 파라미터에도 넣지 않는다.
 *   user_id는 내부 cuid(가명 ID)만 사용.
 * - NEXT_PUBLIC_GA_ID 미설정이면 전부 no-op — 기능에 영향 없음.
 * - 모든 이벤트에 app_platform(web|ios_app) 자동 부착 — iOS 셸은 UA에 BFSOSApp.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const EV = {
  // GA4 권장 이벤트 (공식 이름)
  SIGN_UP: "sign_up",
  LOGIN: "login",
  BEGIN_CHECKOUT: "begin_checkout",
  PURCHASE: "purchase",
  // BFS OS 고유 이벤트
  BUILDING_REGISTERED: "building_registered",
  DASHBOARD_VIEWED: "dashboard_viewed",
  WORK_ORDER_CREATED: "work_order_created",
  AI_CLASSIFICATION_USED: "ai_classification_used",
  WORK_ORDER_ASSIGNED: "work_order_assigned",
  WORK_ORDER_STARTED: "work_order_started",
  WORK_ORDER_COMPLETED: "work_order_completed",
  MEMBER_ADDED: "member_added",
} as const;

export type EventName = (typeof EV)[keyof typeof EV];
type ParamValue = string | number | boolean;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// gtag.js 로드 전이라도 dataLayer 스텁에 쌓아두면 로드 후 일괄 처리된다(초기 이벤트 유실 방지)
function enabled() {
  if (!GA_ID || typeof window === "undefined") return false;
  if (typeof window.gtag !== "function") {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  return true;
}

function platform() {
  if (typeof navigator === "undefined") return "web";
  return navigator.userAgent.includes("BFSOSApp") ? "ios_app" : "web";
}

/** 이벤트 전송 — 실패해도 앱 동작에 영향을 주지 않는다. */
export function track(name: EventName, params: Record<string, ParamValue> = {}) {
  if (!enabled()) return;
  try {
    window.gtag!("event", name, { ...params, app_platform: platform() });
  } catch {
    /* 무시 */
  }
}

/** SPA 라우트 전환용 page_view */
export function trackPageView(path: string) {
  if (!enabled()) return;
  try {
    window.gtag!("event", "page_view", { page_path: path, app_platform: platform() });
  } catch {
    /* 무시 */
  }
}

/** 로그인 사용자 컨텍스트 — 가명 ID와 역할만 */
export function setAnalyticsUser(userId: string | null, role?: string) {
  if (!enabled()) return;
  try {
    window.gtag!("config", GA_ID, { user_id: userId ?? undefined, send_page_view: false });
    if (role) window.gtag!("set", "user_properties", { user_role: role });
  } catch {
    /* 무시 */
  }
}
