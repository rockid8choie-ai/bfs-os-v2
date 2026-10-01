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

import { ampSetUser, ampSetUserProps, ampTrack } from "./amplitude";

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
  // BFS 매치 브릿지 — 내부 처리 불가 → 외주 전환 (두 앱 통합 판단 근거)
  OUTSOURCE_CLICKED: "outsource_clicked",
  // A/B 테스트 노출 — lib/experiments.ts가 기록
  EXPERIMENT_VIEWED: "experiment_viewed",
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


/* ── UTM 유입 어트리뷰션 ──
   세션·최초유입 어트리뷰션은 GA4가 URL의 utm_*로 자동 처리한다(중복 전송 금지).
   여기서는 GA가 이벤트 파라미터로 내려주지 않는 first-touch만 보존한다:
   최초 방문 1회 저장(불변) → 이후 모든 이벤트에 ft_* 자동 첨부 + user_properties. */

const FT_KEY = "bfs_first_touch";

type FirstTouch = {
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
  term?: string;
  id?: string;
  landing?: string;
  at?: string;
};

function readUtmFromUrl(): Partial<FirstTouch> | null {
  const sp = new URLSearchParams(window.location.search);
  const g = (k: string) => {
    const v = sp.get(k)?.trim().toLowerCase();
    return v || undefined; // 소문자 정규화 — taxonomy 혼용 방지
  };
  const source = g("utm_source");
  const medium = g("utm_medium");
  if (!source && !medium) return null;
  return {
    source: source ?? "(not set)",
    medium: medium ?? "(not set)",
    campaign: g("utm_campaign"),
    content: g("utm_content"),
    term: g("utm_term"),
    id: g("utm_id"),
  };
}

function setFirstTouchUserProps(ft: FirstTouch) {
  const props = {
    first_touch_source: ft.source,
    first_touch_medium: ft.medium,
    ...(ft.campaign ? { first_touch_campaign: ft.campaign } : {}),
  };
  if (enabled()) window.gtag!("set", "user_properties", props);
  ampSetUserProps(props);
}

/** 최초 유입 캡처 — 저장된 값이 있으면 절대 덮어쓰지 않는다(first-touch 불변). */
export function captureFirstTouch() {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(FT_KEY);
    if (stored) {
      setFirstTouchUserProps(JSON.parse(stored) as FirstTouch);
      return;
    }
    const utm = readUtmFromUrl();
    let ft: FirstTouch;
    if (utm) {
      ft = utm as FirstTouch;
    } else {
      // utm 없는 최초 방문도 기록해야 이후 광고 클릭이 first-touch를 못 덮는다
      let refHost = "";
      try {
        refHost = document.referrer ? new URL(document.referrer).hostname : "";
      } catch {
        /* 무시 */
      }
      ft =
        refHost && refHost !== window.location.hostname
          ? { source: refHost, medium: "referral" }
          : { source: "(direct)", medium: "(none)" };
    }
    ft.landing = window.location.pathname;
    ft.at = new Date().toISOString();
    localStorage.setItem(FT_KEY, JSON.stringify(ft));
    setFirstTouchUserProps(ft);
  } catch {
    /* 저장 불가 환경(시크릿 등)에서도 앱 동작 무영향 */
  }
}

function ftParams(): Record<string, string> {
  try {
    const raw = localStorage.getItem(FT_KEY);
    if (!raw) return {};
    const ft = JSON.parse(raw) as FirstTouch;
    return {
      ft_source: ft.source,
      ft_medium: ft.medium,
      ...(ft.campaign ? { ft_campaign: ft.campaign } : {}),
    };
  } catch {
    return {};
  }
}

/** 이벤트 전송 — first-touch(ft_*)와 플랫폼을 자동 첨부. 실패해도 앱 동작 무영향. */
export function track(name: EventName, params: Record<string, ParamValue> = {}) {
  const payload = { ...ftParams(), ...params, app_platform: platform() };
  if (enabled()) {
    try {
      window.gtag!("event", name, payload);
    } catch {
      /* 무시 */
    }
  }
  ampTrack(name, payload);
}

/** SPA 라우트 전환용 page_view */
export function trackPageView(path: string) {
  const payload = { page_path: path, app_platform: platform() };
  if (enabled()) {
    try {
      window.gtag!("event", "page_view", payload);
    } catch {
      /* 무시 */
    }
  }
  ampTrack("page_view", payload);
}

/** 로그인 사용자 컨텍스트 — 가명 ID와 역할만 */
export function setAnalyticsUser(userId: string | null, role?: string) {
  if (enabled()) {
    try {
      window.gtag!("config", GA_ID, { user_id: userId ?? undefined, send_page_view: false });
      if (role) window.gtag!("set", "user_properties", { user_role: role });
    } catch {
      /* 무시 */
    }
  }
  ampSetUser(userId, role ? { user_role: role } : {});
}

/** A/B 배정 결과를 user property로 — 그룹별 퍼널·리텐션 분석의 근거가 된다. */
export function setExperimentProperty(key: string, variant: string) {
  const prop = { [`exp_${key}`]: variant };
  if (enabled()) {
    try {
      window.gtag!("set", "user_properties", prop);
    } catch {
      /* 무시 */
    }
  }
  ampSetUserProps(prop);
}
