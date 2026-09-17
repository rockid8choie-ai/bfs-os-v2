// 공개 요금표(빌딩당 월) — 서버·클라이언트 공용.
export type PlanKey = "free" | "standard" | "pro";

// 당분간 전부 무료(2026-09-17 결정) — 유료 전환 시 true로 바꾸면
// 요금 페이지의 플랜 카드·결제 버튼과 결제 API가 함께 열린다.
export const BILLING_LIVE = false;

export const PLANS: Record<
  PlanKey,
  { label: string; monthly: number; tagline: string; features: string[] }
> = {
  free: {
    label: "Free",
    monthly: 0,
    tagline: "빌딩 1개, 핵심 루프만",
    features: ["AI 접수·분류", "작업 배정·처리", "민원 관리", "팀원 3명까지"],
  },
  standard: {
    label: "Standard",
    monthly: 120000,
    tagline: "운영 리포트까지",
    features: [
      "Free 전부 포함",
      "팀원 무제한",
      "주간 운영 리포트",
      "아낀 시간 집계",
      "이메일 지원",
    ],
  },
  pro: {
    label: "Pro",
    monthly: 290000,
    tagline: "다건물·감사 대응",
    features: [
      "Standard 전부 포함",
      "다건물 통합 뷰",
      "법정점검 캘린더",
      "이력 내보내기(감사 대응)",
      "우선 지원",
    ],
  },
};

export const won = (n: number) => n.toLocaleString("ko-KR");
