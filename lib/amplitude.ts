"use client";

/**
 * Amplitude 수집 레이어 — GA4와 병행하는 제품 분석 채널.
 *
 * 원칙
 * - lib/analytics.ts를 통해서만 호출된다(화면 코드는 Amplitude를 직접 모른다).
 * - NEXT_PUBLIC_AMPLITUDE_KEY 미설정이면 SDK 자체를 내려받지 않는다(완전 no-op).
 * - 자동 수집은 최소화: 세션·유입만 켜고 요소/폼 상호작용은 끈다.
 *   폼 자동 수집은 이메일·비밀번호 입력 필드를 건드릴 수 있어 개인정보 원칙에 어긋난다.
 * - page_view는 우리가 직접 보낸다(SPA 라우팅이라 자동 수집과 이중 집계됨).
 */

import type * as AmplitudeModule from "@amplitude/analytics-browser";

export const AMPLITUDE_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_KEY ?? "";

type Amp = typeof AmplitudeModule;

let amp: Amp | null = null;
let loader: Promise<Amp | null> | null = null;
const queue: Array<(a: Amp) => void> = [];

function ensure(): Promise<Amp | null> {
  if (loader) return loader;
  loader = import("@amplitude/analytics-browser")
    .then((mod) => {
      mod.init(AMPLITUDE_KEY, {
        autocapture: {
          attribution: true, // Amplitude 자체 유입 어트리뷰션(우리 ft_*와 보완 관계)
          sessions: true,
          pageViews: false,
          elementInteractions: false,
          formInteractions: false,
          fileDownloads: false,
        },
      });
      amp = mod;
      queue.splice(0).forEach((fn) => {
        try {
          fn(mod);
        } catch {
          /* 무시 */
        }
      });
      return mod;
    })
    .catch(() => null);
  return loader;
}

/** SDK 로드 전 호출은 큐에 쌓아 두고 로드 후 일괄 실행한다(초기 이벤트 유실 방지). */
function run(fn: (a: Amp) => void) {
  if (!AMPLITUDE_KEY || typeof window === "undefined") return;
  if (amp) {
    try {
      fn(amp);
    } catch {
      /* 무시 */
    }
    return;
  }
  queue.push(fn);
  void ensure();
}

export function initAmplitude() {
  if (AMPLITUDE_KEY && typeof window !== "undefined") void ensure();
}

export function ampTrack(name: string, props: Record<string, unknown> = {}) {
  run((a) => a.track(name, props));
}

export function ampSetUserProps(props: Record<string, string>) {
  const keys = Object.keys(props);
  if (keys.length === 0) return;
  run((a) => {
    const identify = new a.Identify();
    keys.forEach((k) => identify.set(k, props[k]));
    a.identify(identify);
  });
}

export function ampSetUser(userId: string | null, props: Record<string, string> = {}) {
  run((a) => a.setUserId(userId ?? undefined));
  ampSetUserProps(props);
}
