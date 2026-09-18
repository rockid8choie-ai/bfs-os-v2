// 화면 타입·카피. 업무 데이터는 서버/DB가 진실이다.
export type Priority = "긴급" | "높음" | "보통";
export type WoStatus = "대기" | "배정됨" | "진행중" | "완료";

/** 배정 추천에 쓰는 전문분야 키 — 민원 AI 태그와 같은 어휘를 공유한다 */
export type Specialty = "배관·급수" | "전기·조명" | "승강기" | "소방·안전" | "공조·환기";

export const SPECIALTIES: Specialty[] = [
  "배관·급수",
  "전기·조명",
  "승강기",
  "소방·안전",
  "공조·환기",
];

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
