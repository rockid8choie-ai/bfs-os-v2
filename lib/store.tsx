"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, ApiClientError } from "./api";
import { recommend, type Recommendation } from "./assign";
import { BUILDING, type Member, type Priority, type Role, type Specialty, type Voc, type WoStatus, type WorkOrder } from "./mock";

export type Filter = "전체" | WoStatus;

interface NewOrderInput {
  title: string;
  location?: string;
  priority: Priority;
  specialty: Specialty;
  source: string;
  due?: string;
  vocId?: string;
  assigneeId?: string;
  autoAssign?: boolean;
}

type PublicUser = Member & { email?: string; buildingName?: string };

interface AppState {
  ready: boolean;
  authenticated: boolean;
  loading: boolean;
  error: string | null;
  clearError: () => void;

  role: Role;
  me: PublicUser | null;
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

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;

  assign: (orderId: string, memberId: string) => Promise<void>;
  advance: (orderId: string) => Promise<void>;
  createOrder: (input: NewOrderInput) => Promise<WorkOrder>;
  convertVoc: (vocId: string) => Promise<string>;

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
  buildingName: string;
}

const Ctx = createContext<AppState | null>(null);

function messageOf(error: unknown) {
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return "요청에 실패했습니다.";
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<PublicUser | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [vocs, setVocs] = useState<Voc[]>([]);
  const [filter, setFilter] = useState<Filter>("전체");
  const [assignTarget, setAssignTarget] = useState<string | null>(null);
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [memberTarget, setMemberTarget] = useState<{
    memberId: string;
    fromOrderId?: string;
  } | null>(null);

  const role: Role = me?.role ?? "manager";
  const techs = useMemo(() => members.filter((m) => m.role === "tech"), [members]);

  const memberById = useCallback(
    (id?: string) => (id ? members.find((m) => m.id === id) : undefined),
    [members]
  );

  const loadOf = useCallback(
    (memberId: string) =>
      orders.filter(
        (o) => o.assigneeId === memberId && (o.status === "배정됨" || o.status === "진행중")
      ).length,
    [orders]
  );

  const doneTodayOf = useCallback(
    (memberId: string) =>
      orders.filter((o) => o.assigneeId === memberId && o.status === "완료").length,
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

  const refresh = useCallback(async () => {
    const [memberRes, orderRes, vocRes] = await Promise.all([
      api.get<{ members: Member[] }>("/api/members"),
      api.get<{ orders: WorkOrder[] }>("/api/work-orders"),
      api.get<{ vocs: Voc[] }>("/api/vocs"),
    ]);
    setMembers(memberRes.members);
    setOrders(orderRes.orders);
    setVocs(vocRes.vocs);
  }, []);

  const bootstrap = useCallback(async () => {
    try {
      const { user } = await api.get<{ user: PublicUser }>("/api/auth/me");
      setMe(user);
      await refresh();
    } catch (err) {
      setMe(null);
      setMembers([]);
      setOrders([]);
      setVocs([]);
      if (err instanceof ApiClientError && err.status !== 401) {
        setError(messageOf(err));
      }
    } finally {
      setReady(true);
    }
  }, [refresh]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const run = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      const text = messageOf(err);
      setError(text);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      await run(async () => {
        const { user } = await api.post<{ user: PublicUser }>("/api/auth/login", {
          email,
          password,
        });
        setMe(user);
        await refresh();
      });
    },
    [refresh, run]
  );

  const logout = useCallback(async () => {
    await run(async () => {
      await api.post("/api/auth/logout");
      setMe(null);
      setMembers([]);
      setOrders([]);
      setVocs([]);
    });
  }, [run]);

  const assign = useCallback(
    async (orderId: string, memberId: string) => {
      await run(async () => {
        const { order } = await api.patch<{ order: WorkOrder }>(`/api/work-orders/${orderId}`, {
          action: "assign",
          assigneeId: memberId,
        });
        setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
      });
    },
    [run]
  );

  const advance = useCallback(
    async (orderId: string) => {
      await run(async () => {
        const { order } = await api.patch<{ order: WorkOrder }>(`/api/work-orders/${orderId}`, {
          action: "advance",
        });
        setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
        if (order.status === "완료" && order.vocId) {
          setVocs((prev) =>
            prev.map((v) => (v.id === order.vocId ? { ...v, status: "완료" } : v))
          );
        }
      });
    },
    [run]
  );

  const createOrder = useCallback(
    async (input: NewOrderInput) => {
      return run(async () => {
        const { order } = await api.post<{ order: WorkOrder }>("/api/work-orders", input);
        setOrders((prev) => [order, ...prev.filter((o) => o.id !== order.id)]);
        return order;
      });
    },
    [run]
  );

  const convertVoc = useCallback(
    async (vocId: string) => {
      return run(async () => {
        const { order, voc } = await api.post<{ order: WorkOrder; voc: Voc }>(
          `/api/vocs/${vocId}/convert`
        );
        setOrders((prev) => {
          const rest = prev.filter((o) => o.id !== order.id);
          return [order, ...rest];
        });
        setVocs((prev) => prev.map((v) => (v.id === voc.id ? voc : v)));
        return order.id;
      });
    },
    [run]
  );

  const visibleOrders = orders;

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

  const savedHours = useMemo(
    () => BUILDING.savedHoursBase + Math.round(autoAssigned * 1.2),
    [autoAssigned]
  );

  const value: AppState = {
    ready,
    authenticated: Boolean(me),
    loading,
    error,
    clearError: () => setError(null),
    role,
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
    login,
    logout,
    refresh,
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
    buildingName: me?.buildingName ?? BUILDING.name,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
