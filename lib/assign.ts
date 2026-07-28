// BFS OS v2.1 — AI 분류 · 자동 배정 규칙
// 베타는 규칙 기반 시뮬레이션. 실서비스에서는 코파일럿 API로 대체하되
// "추천 이유를 항상 한 줄로 보여준다"는 계약은 그대로 유지한다.
import type { Member, Priority, Specialty, WorkOrder } from "./mock";

export type IntakeKind = "work" | "voc" | "issue";

export interface Classified {
  kind: IntakeKind;
  label: string; // 화면에 보여줄 접수 유형
  reason: string; // 왜 그렇게 판단했는지
  specialty: Specialty;
  priority: Priority;
}

/** 한 줄 입력 → 유형 + 전문분야 + 우선순위 */
export function classify(text: string): Classified {
  const t = text.trim();

  const specialty: Specialty = /(누수|물|배관|화장실|온수|급수|하수)/.test(t)
    ? "배관·급수"
    : /(승강기|엘리베이터|리프트)/.test(t)
      ? "승강기"
      : /(조명|전등|정전|콘센트|전기|차단기)/.test(t)
        ? "전기·조명"
        : /(화재|소방|스프링클러|감지기|비상)/.test(t)
          ? "소방·안전"
          : /(에어컨|냉방|난방|환기|공조|덥|추)/.test(t)
            ? "공조·환기"
            : "배관·급수";

  if (/(고장|정지|알람|경보|화재|정전|멈춤|누전)/.test(t))
    return {
      kind: "issue",
      label: "긴급 이슈",
      reason: "즉시 대응이 필요한 이상 상황으로 판단",
      specialty,
      priority: "긴급",
    };

  if (/(불만|시끄|냄새|요청|문의|불편|민원)/.test(t))
    return {
      kind: "voc",
      label: "민원 · 입주사 응대",
      reason: "입주사 커뮤니케이션 사안으로 판단",
      specialty,
      priority: "보통",
    };

  if (/(누수|물|배관|화장실|온수)/.test(t))
    return {
      kind: "work",
      label: "작업지시 · 배관",
      reason: "설비 조치가 필요한 내용으로 판단",
      specialty,
      priority: "높음",
    };

  return {
    kind: "work",
    label: "작업지시 · 일반",
    reason: "현장 조치 사항으로 판단",
    specialty,
    priority: "보통",
  };
}

export interface Recommendation {
  member: Member;
  reason: string;
}

/** 담당자의 현재 부하 = 배정됨 + 진행중 건수 */
export function loadOf(orders: WorkOrder[], memberId: string) {
  return orders.filter(
    (o) =>
      o.assigneeId === memberId &&
      (o.status === "배정됨" || o.status === "진행중")
  ).length;
}

/**
 * R-1 전문분야 일치 우선 → R-2 동점이면 부하 최소
 * R-3 긴급은 부하를 무시하고 전문분야 1순위 → R-4 일치자 없으면 전체 부하 최소
 * R-5 추천은 확정이 아니다. 호출부는 항상 변경 수단을 함께 제공해야 한다.
 */
export function recommend(
  members: Member[],
  orders: WorkOrder[],
  specialty?: Specialty,
  priority: Priority = "보통"
): Recommendation | null {
  const techs = members.filter((m) => m.role === "tech");
  if (techs.length === 0) return null;

  const matched = specialty
    ? techs.filter((m) => m.specialty.includes(specialty))
    : [];

  if (matched.length > 0) {
    const sorted = [...matched].sort(
      (a, b) => loadOf(orders, a.id) - loadOf(orders, b.id)
    );
    const member = sorted[0];
    const load = loadOf(orders, member.id);

    if (priority === "긴급")
      return { member, reason: `긴급 · ${specialty} 담당이라 즉시 배정` };

    return {
      member,
      reason:
        load === 0
          ? `${specialty} 담당 · 지금 진행중인 작업 없음`
          : `${specialty} 담당 · 현재 ${load}건으로 여유 있음`,
    };
  }

  const sorted = [...techs].sort(
    (a, b) => loadOf(orders, a.id) - loadOf(orders, b.id)
  );
  const member = sorted[0];
  return {
    member,
    reason: `전담자가 없어 지금 가장 여유 있는 담당자 (${loadOf(orders, member.id)}건)`,
  };
}

/** 이니셜 — 아바타 표기용 (한글은 성 1자) */
export function initialOf(name: string) {
  return name.slice(0, 1);
}
