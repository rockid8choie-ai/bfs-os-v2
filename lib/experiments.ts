"use client";

/**
 * A/B 테스트 프레임워크 — 외부 서비스 없이 동작한다(고정비 0).
 *
 * 설계
 * - 배정은 결정론적: hash(익명ID + 실험키)로 버킷을 계산해 같은 사용자는 항상 같은 그룹.
 * - 한 번 정해진 배정은 localStorage에 고정 — 가중치를 바꿔도 기존 사용자는 그룹이 안 바뀐다.
 * - 노출(exposure)은 "실제로 화면을 본 사람"만 세션당 1회 기록 → 전환율 분모가 정확해진다.
 * - 배정 결과는 이벤트 파라미터이자 user property(exp_<키>)로 나가서
 *   GA4·Amplitude 양쪽에서 그룹별 퍼널·리텐션을 그대로 자를 수 있다.
 * - 개인정보 없음: 익명ID는 브라우저에서 만든 난수이고 서버로 보내지 않는다.
 */

import { useEffect, useRef, useState } from "react";
import { EV, setExperimentProperty, track } from "./analytics";

export interface ExperimentDef {
  key: string;
  /** 무엇을 검증하는가 — 나중에 결과를 해석할 사람을 위해 반드시 적는다. */
  hypothesis: string;
  /** 성공 판정에 쓸 지표(지표 설계 보고서의 이름과 맞춘다). */
  metric: string;
  variants: readonly string[];
  /** 생략 시 균등 배분. variants와 길이가 같아야 한다. */
  weights?: readonly number[];
  enabled: boolean;
}

/** 실행 중인 실험 목록 — 끝난 실험은 enabled:false로 두고 결과를 주석에 남긴다. */
export const EXPERIMENTS = {
  first_order_nudge: {
    key: "first_order_nudge",
    hypothesis:
      "가입 직후 빈 화면에 '첫 접수' 유도 카드를 보여주면 첫 작업 접수(Aha)까지 더 빨리 도달한다",
    metric: "Activation Rate(가입→첫 접수) · Time to Aha",
    variants: ["control", "nudge"],
    enabled: true,
  },
} as const satisfies Record<string, ExperimentDef>;

export type ExperimentKey = keyof typeof EXPERIMENTS;

const ANON_KEY = "bfs_anon_id";

/** 브라우저 단위 익명 ID — 실험 배정 전용. 서버로 전송하지 않는다. */
function anonId(): string {
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    return "no-storage";
  }
}

/** FNV-1a — 짧고 분포가 고른 해시. 암호용이 아니라 버킷 계산용. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick(exp: ExperimentDef, id: string): string {
  const weights = exp.weights ?? exp.variants.map(() => 1);
  const total = weights.reduce((a, b) => a + b, 0);
  let point = ((hash(`${id}:${exp.key}`) % 10000) / 10000) * total;
  for (let i = 0; i < exp.variants.length; i++) {
    point -= weights[i] ?? 0;
    if (point < 0) return exp.variants[i];
  }
  return exp.variants[0];
}

/** 이 사용자의 배정 그룹. 서버 렌더링 중에는 항상 기준군(control)을 돌려준다. */
export function getVariant(key: ExperimentKey): string {
  const exp = EXPERIMENTS[key] as ExperimentDef;
  if (!exp.enabled || typeof window === "undefined") return exp.variants[0];

  const storeKey = `bfs_exp_${exp.key}`;
  try {
    const saved = localStorage.getItem(storeKey);
    if (saved && exp.variants.includes(saved)) return saved;
  } catch {
    /* 저장 불가 환경 — 매번 계산해도 결과는 같다 */
  }

  const variant = pick(exp, anonId());
  try {
    localStorage.setItem(storeKey, variant);
  } catch {
    /* 무시 */
  }
  return variant;
}

/** 노출 기록 — 세션당 1회. 화면을 실제로 본 사용자만 실험 대상에 들어간다. */
export function trackExposure(key: ExperimentKey, variant: string) {
  const onceKey = `bfs_exp_seen_${key}`;
  try {
    if (sessionStorage.getItem(onceKey)) return;
    sessionStorage.setItem(onceKey, "1");
  } catch {
    /* 저장 불가 환경에서는 중복 기록을 감수한다 */
  }
  track(EV.EXPERIMENT_VIEWED, { experiment_key: key, variant });
  setExperimentProperty(key, variant);
}

/**
 * 화면에서 쓰는 훅.
 * @param active 이 실험 화면이 실제로 보이는 조건 — true가 될 때만 노출을 기록한다.
 */
export function useExperiment(key: ExperimentKey, active = true): string {
  const [variant, setVariant] = useState<string>(
    () => (EXPERIMENTS[key] as ExperimentDef).variants[0]
  );
  const fired = useRef(false);

  useEffect(() => {
    const v = getVariant(key);
    setVariant(v);
    if (active && !fired.current) {
      fired.current = true;
      trackExposure(key, v);
    }
  }, [key, active]);

  return variant;
}
