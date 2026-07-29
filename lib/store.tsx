"use client";

// BFS OS v2.1 — 앱 전역 상태
// v2에서는 페이지마다 목업을 각자 useState로 복사해 써서 화면 간 흐름이 끊겼다.
// (접수해도 목록에 안 쌓이고, 민원을 전환해도 작업이 생기지 않음)
// 배정은 "여러 화면이 같은 데이터를 본다"는 전제가 있어야 성립하므로 스토어로 통일한다.
// v3에서 Supabase 쿼리로 교체할 때 이 인터페이스가 그대로 경계가 된다.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BUILDING,
  MEMBERS,
  VOCS,
  WORK_ORDERS,
  type Member,
  type Priority,
  type Role,
  type Specialty,
  type Voc,
  type WorkOrder,
  type WoStatus,
} from "./mock";
import { loadOf as calcLoad, recommend, type Recommendation } from "./assign";

export type Filter = "전체" | WoStatus;

interface NewOrderInput {
  title: string;
  location?: string;
  priority: Priority;
  specialty: Specialty;
  source: string;
  due?: string;
  vocId?: string;
}

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  me: Member;
  members: Member[];
  techs: Member[];
  memberById: (id?: string) => Member | undefined;

  orders: WorkOrder[];
  vocs: Voc[];
  visibleOrders: WorkOrder[];

  loadOf: (memberId: string) => number;
  doneTodayOf: (memberId: string) => number;
  ordersOf: (memberId: string) => WorkOrder[];
  recommendFor: (o: WorkOrder) => Recommendation | null;

  assign: (orderId: string, memberId: string) => void;
  advance: (orderId: string) => void;
  createOrder: (input: NewOrderInput) => string;
  convertVoc: (vocId: string) => string;

  filter: Filter;
  setFilter: (f: Filter) => void;

  assignTarget: string | null;
  openAssign: (orderId: string) => void;
  closeAssign: () => void;

  intakeOpen: boolean;
  openIntake: () => void;
  closeIntake: () => void;

  memberTarget: { memberId: string; fromOrderId?: string } | null;
  openMember: (memberId: string, fromOrderId?: string) => void;
  closeMember: () => void;

  autoAssigned: number;
  savedHours: number;
  counts: Record<Exclude<Filter, "전체">, number>;
}

const Ctx = createContext<AppState | null>(null);

function stamp() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `오늘 ${hh}:${mm}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("manager");
  const [orders, setOrders] = useState<WorkOrder[]>(WORK_ORDERS);
  const [vocs, setVocs] = useState<Voc[]>(VOCS);
  const [filter, setFilter] = useState<Filter>("전체");
  const [assignTarget, setAssignTarget] = useState<string | null>(null);
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [memberTarget, setMemberTarget] = useState<{
    memberId: string;
    fromOrderId?: string;
  } | null>(null);
  const [seq, setSeq] = useState(100);

  const members = MEMBERS;
  const techs = useMemo(() => members.filter((m) => m.role === "tech"), [members]);
  const manager = members.find((m) => m.role === "manager")!;
  // 베타 시연용 팀원 계정 — 인증 도입 시 로그인 사용자로 대체
  const me = role === "manager" ? manager : techs[0];

  const memberById = useCallback(
    (id?: string) => (id ? members.find((m) => m.id === id) : undefined),
    [members]
  );

  const loadOf = useCallback(
    (memberId: string) => calcLoad(orders, memberId),
    [orders]
  );

  const doneTodayOf = useCallback(
    (memberId: string) =>
      orders.filter((o) => o.assigneeId === memberId && o.status === "완료")
        .length,
    [orders]
  );

  const ordersOf = useCallback(
    (memberId: string) => orders.filter((o) => o.assigneeId === memberId),
    [orders]
  );

  const recommendFor = useCallback(
    (o: WorkOrder) => recommend(members, orders, o.specialty, o.priority),
    [members, orders]
  );

  const assign = useCallback(
    (orderId: string, memberId: string) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                assigneeId: memberId,
                assignedBy: role === "manager" ? manager.id : memberId,
                assignedAt: stamp(),
                // 완료된 작업의 재배정은 상태를 되돌리지 않는다
                status: o.status === "완료" ? o.status : ("배정됨" as WoStatus),
              }
            : o
        )
      );
    },
    [manager.id, role]
  );

  const advance = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        if (o.status === "배정됨") return { ...o, status: "진행중" as WoStatus };
        if (o.status === "진행중") {
          // 작업이 끝나면 연결된 민원도 완료 후보로 넘긴다
          if (o.vocId) {
            setVocs((vs) =>
              vs.map((v) => (v.id === o.vocId ? { ...v, status: "완료" as const } : v))
            );
          }
          return { ...o, status: "완료" as WoStatus };
        }
        return o;
      })
    );
  }, []);

  const createOrder = useCallback(
    (input: NewOrderInput) => {
      const id = `w${seq}`;
      setSeq((s) => s + 1);
      setOrders((prev) => [
        {
          id,
          title: input.title,
          location: input.location ?? "위치 미지정",
          due: input.due ?? "오늘",
          status: "대기",
          priority: input.priority,
          source: input.source,
          specialty: input.specialty,
          vocId: input.vocId,
        },
        ...prev,
      ]);
      return id;
    },
    [seq]
  );

  const convertVoc = useCallback(
    (vocId: string) => {
      const v = vocs.find((x) => x.id === vocId);
      const existing = orders.find((o) => o.vocId === vocId);
      if (existing) return existing.id;

      const id = `w${seq}`;
      setSeq((s) => s + 1);
      setOrders((prev) => [
        {
          id,
          title: v ? `${v.tenant.split(" · ")[0]} ${v.title}` : "민원 전환 작업",
          location: v ? v.tenant.split(" · ")[0] : "위치 미지정",
          due: "오늘",
          status: "대기",
          priority: "높음",
          source: `민원 #${vocId}`,
          specialty: v?.specialty ?? "배관·급수",
          vocId,
        },
        ...prev,
      ]);
      setVocs((prev) =>
        prev.map((x) =>
          x.id === vocId ? { ...x, status: "처리중" as const, workOrderId: id } : x
        )
      );
      return id;
    },
    [orders, seq, vocs]
  );

  const visibleOrders = useMemo(
    () => (role === "tech" ? orders.filter((o) => o.assigneeId === me.id) : orders),
    [me.id, orders, role]
  );

  const counts = useMemo(
    () => ({
      대기: visibleOrders.filter((o) => o.status === "대기").length,
      배정됨: visibleOrders.filter((o) => o.status === "배정됨").length,
      진행중: visibleOrders.filter((o) => o.status === "진행중").length,
      완료: visibleOrders.filter((o) => o.status === "완료").length,
    }),
    [visibleOrders]
  );

  const autoAssigned = useMemo(
    () => orders.filter((o) => o.assigneeId).length,
    [orders]
  );

  // F-12: "이번 주 아낀 시간"에 실제 근거를 연결 — 배정 건수에 비례해 가산
  const savedHours = useMemo(
    () => BUILDING.savedHoursBase + Math.round(autoAssigned * 1.2),
    [autoAssigned]
  );

  const value: AppState = {
    role,
    setRole,
    me,
    members,
    techs,
    memberById,
    orders,
    vocs,
    visibleOrders,
    loadOf,
    doneTodayOf,
    ordersOf,
    recommendFor,
    assign,
    advance,
    createOrder,
    convertVoc,
    filter,
    setFilter,
    assignTarget,
    openAssign: setAssignTarget,
    closeAssign: () => setAssignTarget(null),
    intakeOpen,
    openIntake: () => setIntakeOpen(true),
    closeIntake: () => setIntakeOpen(false),
    memberTarget,
    openMember: (memberId, fromOrderId) => setMemberTarget({ memberId, fromOrderId }),
    closeMember: () => setMemberTarget(null),
    autoAssigned,
    savedHours,
    counts,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
