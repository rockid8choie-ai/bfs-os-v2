// BFS OS v2 베타 — 목업 데이터 (Supabase 연동 전 단계)
export type Priority = "긴급" | "높음" | "보통";
export type WoStatus = "대기" | "진행중" | "완료";

export interface FeedItem {
  id: string;
  kind: "alarm" | "voc" | "work" | "inspection";
  title: string;
  detail: string;
  priority?: Priority;
  cta: string;
  href: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  location: string;
  due: string;
  status: WoStatus;
  priority: Priority;
  source: string;
}

export interface Voc {
  id: string;
  title: string;
  tenant: string;
  createdAt: string;
  status: "접수" | "처리중" | "완료";
  aiTag: string;
}

export const BUILDING = {
  name: "역삼타워",
  todayCount: 4,
  weeklyRate: 82,
  savedHoursWeek: 26, // AI 분류·자동 배정·리포트 자동화로 절감된 시간(주간)
};

// 공개 요금표 — 국내 경쟁사 전원 가격 비공개·상담형인 시장에서 그 자체가 차별점
export const PLANS = [
  {
    name: "Free",
    price: "0원",
    unit: "빌딩 1개",
    highlight: false,
    features: ["민원 접수 + 작업지시", "시설팀 3좌석", "입주사 포털 (요청 무제한 무료)"],
    cta: "무료로 시작",
  },
  {
    name: "Standard",
    price: "12만원",
    unit: "빌딩당 / 월",
    highlight: true,
    features: ["시설팀 좌석 무제한", "예방정비 · 법정점검 알림", "주간·월간 리포트", "이력 무제한"],
    cta: "14일 무료 체험",
  },
  {
    name: "Pro",
    price: "29만원",
    unit: "빌딩당 / 월",
    highlight: false,
    features: ["Standard 전체 포함", "통합관제 대시보드", "AI 코파일럿 (자동 분류·요약)", "센서 알람 연동 · API"],
    cta: "14일 무료 체험",
  },
] as const;

export const FEED: FeedItem[] = [
  {
    id: "f1",
    kind: "alarm",
    title: "지하2층 급수펌프 압력 이상",
    detail: "센서 알람 · 8분 전",
    priority: "긴급",
    cta: "지금 확인",
    href: "/work-orders",
  },
  {
    id: "f2",
    kind: "voc",
    title: "새 민원 2건 — 302호 누수 외",
    detail: "입주사 포털 접수 · AI 분류: 배관 / 작업 필요",
    cta: "작업 지시",
    href: "/voc",
  },
  {
    id: "f3",
    kind: "work",
    title: "오늘 마감 작업 2건",
    detail: "옥상 배수구 점검 · 로비 조명 교체",
    cta: "작업 보기",
    href: "/work-orders",
  },
  {
    id: "f4",
    kind: "inspection",
    title: "소방시설 법정점검 D-7",
    detail: "마감 7/30 · 담당 미지정",
    cta: "담당 지정",
    href: "/work-orders",
  },
];

export const WORK_ORDERS: WorkOrder[] = [
  { id: "w1", title: "지하2층 급수펌프 점검", location: "B2 기계실", due: "오늘", status: "대기", priority: "긴급", source: "센서 알람" },
  { id: "w2", title: "302호 천장 누수 보수", location: "3F 302호", due: "오늘", status: "대기", priority: "높음", source: "민원 #v1" },
  { id: "w3", title: "옥상 배수구 정기 점검", location: "RF", due: "오늘", status: "진행중", priority: "보통", source: "정기 일정" },
  { id: "w4", title: "로비 조명 3구 교체", location: "1F 로비", due: "오늘", status: "진행중", priority: "보통", source: "순찰 발견" },
  { id: "w5", title: "엘리베이터 2호기 이음 점검", location: "공용", due: "내일", status: "대기", priority: "높음", source: "민원 #v2" },
];

export const VOCS: Voc[] = [
  { id: "v1", title: "천장에서 물이 떨어져요", tenant: "302호 · 그린테크", createdAt: "오늘 08:40", status: "접수", aiTag: "배관·누수" },
  { id: "v2", title: "엘리베이터에서 이상한 소리가 나요", tenant: "701호 · 한빛법무", createdAt: "오늘 07:55", status: "접수", aiTag: "승강기" },
  { id: "v3", title: "지하주차장 B1 조명이 어두워요", tenant: "205호 · 다온디자인", createdAt: "어제", status: "처리중", aiTag: "전기·조명" },
  { id: "v4", title: "화장실 온수가 안 나와요", tenant: "402호 · 세움회계", createdAt: "어제", status: "완료", aiTag: "급탕" },
];

export const MENU_GROUPS = [
  {
    title: "일일 운영",
    items: [
      { label: "이슈", desc: "긴급 상황 추적", ready: true },
      { label: "알림", desc: "알람·시스템 알림 통합", ready: true },
    ],
  },
  {
    title: "자산 관리",
    items: [
      { label: "건물·공간", desc: "빌딩 정보와 도면", ready: false },
      { label: "설비·자산", desc: "설비 대장과 이력", ready: false },
      { label: "예방정비", desc: "정기 점검 일정", ready: false },
      { label: "법정점검", desc: "소방·승강기·전기 의무 점검", ready: false },
    ],
  },
  {
    title: "분석",
    items: [
      { label: "통합관제", desc: "빌딩 전체 현황 대시보드", ready: false },
      { label: "리포트", desc: "주간·월간 운영 보고서", ready: false },
    ],
  },
] as const;
