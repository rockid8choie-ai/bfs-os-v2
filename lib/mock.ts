// BFS OS v2.1 — 목업 데이터 (Supabase 연동 전 단계)
export type Priority = "긴급" | "높음" | "보통";
export type WoStatus = "대기" | "배정됨" | "진행중" | "완료";

/** 배정 추천에 쓰는 전문분야 키 — 민원 AI 태그와 같은 어휘를 공유한다 */
export type Specialty = "배관·급수" | "전기·조명" | "승강기" | "소방·안전" | "공조·환기";

export type Role = "manager" | "tech";

export interface Member {
  id: string;
  name: string;
  role: Role;
  title: string; // 화면 표기용 직함
  specialty: Specialty[];
  phone: string;
  years: number;
}

export interface WorkOrder {
  id: string;
  title: string;
  location: string;
  due: string;
  status: WoStatus;
  priority: Priority;
  source: string;
  /** v1 스키마의 work_orders.assigned_to 로 그대로 승격 */
  assigneeId?: string;
  assignedBy?: string;
  assignedAt?: string;
  /** 추천 매칭용 — 민원 AI 태그에서 승계된다 */
  specialty?: Specialty;
  vocId?: string;
}

export interface Voc {
  id: string;
  title: string;
  tenant: string;
  createdAt: string;
  status: "접수" | "처리중" | "완료";
  aiTag: string;
  specialty?: Specialty;
  workOrderId?: string;
}

export const BUILDING = {
  name: "역삼타워",
  weeklyRate: 82,
  savedHoursBase: 18, // 자동 배정 건수에 따라 store에서 가산된다
  savedTrend: [14, 17, 15, 19, 22, 20, 24, 26], // 최근 8주 절감시간
  todayLabel: "7월 24일 목요일",
};

/** 시설팀 구성원 — v3에서 Supabase profiles 로 대체 */
export const MEMBERS: Member[] = [
  {
    id: "u0",
    name: "박정호",
    role: "manager",
    title: "관리소장",
    specialty: ["소방·안전"],
    phone: "010-2841-0033",
    years: 12,
  },
  {
    id: "u1",
    name: "김태식",
    role: "tech",
    title: "시설팀 · 기계",
    specialty: ["배관·급수", "공조·환기"],
    phone: "010-5521-7788",
    years: 8,
  },
  {
    id: "u2",
    name: "이현우",
    role: "tech",
    title: "시설팀 · 전기",
    specialty: ["전기·조명"],
    phone: "010-3390-1142",
    years: 5,
  },
  {
    id: "u3",
    name: "정민석",
    role: "tech",
    title: "시설팀 · 승강기",
    specialty: ["승강기", "소방·안전"],
    phone: "010-7745-9021",
    years: 11,
  },
];

export const WORK_ORDERS: WorkOrder[] = [
  {
    id: "w1",
    title: "지하2층 급수펌프 점검",
    location: "B2 기계실",
    due: "오늘",
    status: "진행중",
    priority: "긴급",
    source: "센서 알람",
    specialty: "배관·급수",
    assigneeId: "u1",
    assignedBy: "u0",
    assignedAt: "오늘 08:12",
  },
  {
    id: "w2",
    title: "302호 천장 누수 보수",
    location: "3F 302호",
    due: "오늘",
    status: "대기",
    priority: "높음",
    source: "민원 #v1",
    specialty: "배관·급수",
    vocId: "v1",
  },
  {
    id: "w3",
    title: "옥상 배수구 정기 점검",
    location: "RF",
    due: "오늘",
    status: "배정됨",
    priority: "보통",
    source: "정기 일정",
    specialty: "배관·급수",
    assigneeId: "u1",
    assignedBy: "u0",
    assignedAt: "어제 17:40",
  },
  {
    id: "w4",
    title: "로비 조명 3구 교체",
    location: "1F 로비",
    due: "오늘",
    status: "진행중",
    priority: "보통",
    source: "순찰 발견",
    specialty: "전기·조명",
    assigneeId: "u2",
    assignedBy: "u0",
    assignedAt: "오늘 09:05",
  },
  {
    id: "w5",
    title: "엘리베이터 2호기 이음 점검",
    location: "공용",
    due: "내일",
    status: "대기",
    priority: "높음",
    source: "민원 #v2",
    specialty: "승강기",
    vocId: "v2",
  },
  {
    id: "w6",
    title: "소방시설 법정점검",
    location: "건물 전체",
    due: "7/30",
    status: "대기",
    priority: "높음",
    source: "법정 의무",
    specialty: "소방·안전",
  },
  {
    id: "w7",
    title: "지하주차장 B1 조명 점등 불량",
    location: "B1 주차장",
    due: "어제",
    status: "완료",
    priority: "보통",
    source: "민원 #v3",
    specialty: "전기·조명",
    assigneeId: "u2",
    assignedBy: "u0",
    assignedAt: "어제 10:20",
    vocId: "v3",
  },
];

export const VOCS: Voc[] = [
  {
    id: "v1",
    title: "천장에서 물이 떨어져요",
    tenant: "302호 · 그린테크",
    createdAt: "오늘 08:40",
    status: "접수",
    aiTag: "배관·누수",
    specialty: "배관·급수",
    workOrderId: "w2",
  },
  {
    id: "v2",
    title: "엘리베이터에서 이상한 소리가 나요",
    tenant: "701호 · 한빛법무",
    createdAt: "오늘 07:55",
    status: "접수",
    aiTag: "승강기",
    specialty: "승강기",
    workOrderId: "w5",
  },
  {
    id: "v3",
    title: "지하주차장 B1 조명이 어두워요",
    tenant: "205호 · 다온디자인",
    createdAt: "어제",
    status: "처리중",
    aiTag: "전기·조명",
    specialty: "전기·조명",
    workOrderId: "w7",
  },
  {
    id: "v4",
    title: "화장실 온수가 안 나와요",
    tenant: "402호 · 세움회계",
    createdAt: "어제",
    status: "완료",
    aiTag: "급탕",
    specialty: "배관·급수",
  },
];

/** 베타 = 무료 체험. 금액 표기 없이 "체험 중 열려 있는 것"만 보여준다 */
export const TRIAL_FEATURES = [
  "민원 접수 + 작업지시 무제한",
  "AI 자동 분류 · 담당자 배정",
  "시설팀 좌석 제한 없음",
  "입주사 포털 (요청 무제한)",
  "예방정비 · 법정점검 알림",
  "주간·월간 리포트",
] as const;

export const MENU_GROUPS = [
  {
    title: "일일 운영",
    items: [
      { label: "이슈", desc: "긴급 상황 추적", ready: true, icon: "alert" },
      { label: "알림", desc: "알람·시스템 알림 통합", ready: true, icon: "bell" },
    ],
  },
  {
    title: "자산 관리",
    items: [
      { label: "건물·공간", desc: "빌딩 정보와 도면", ready: false, icon: "building" },
      { label: "설비·자산", desc: "설비 대장과 이력", ready: false, icon: "wrench" },
      { label: "예방정비", desc: "정기 점검 일정", ready: false, icon: "calendar" },
      { label: "법정점검", desc: "소방·승강기·전기 의무 점검", ready: false, icon: "shield" },
    ],
  },
  {
    title: "분석",
    items: [
      { label: "통합관제", desc: "빌딩 전체 현황 대시보드", ready: false, icon: "chart" },
      { label: "리포트", desc: "주간·월간 운영 보고서", ready: false, icon: "file" },
    ],
  },
] as const;
