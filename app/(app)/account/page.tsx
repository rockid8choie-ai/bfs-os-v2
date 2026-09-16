"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Avatar from "@/components/Avatar";
import { ChevronIcon } from "@/components/icons";
import { SPECIALTIES, type Specialty } from "@/lib/mock";
import { useApp } from "@/lib/store";

const field =
  "mt-1.5 w-full rounded-2xl border border-line bg-card px-4 py-3 text-[15px] outline-none focus:border-brand";
const label = "px-1 text-[12px] font-bold text-sub";
const primaryBtn =
  "w-full rounded-xl bg-brand py-3 text-[14px] font-bold text-white transition-transform active:scale-[0.98] disabled:opacity-40";

function Section({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <section className="rise mt-6" style={{ animationDelay: `${delay}ms` }}>
      <h2 className="px-1 text-[13px] font-bold text-sub">{title}</h2>
      <div className="mt-2.5 rounded-[20px] bg-card p-4">{children}</div>
    </section>
  );
}

function Notice({ tone, text }: { tone: "ok" | "danger"; text: string }) {
  return (
    <p
      className={`mt-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold ${
        tone === "ok" ? "bg-brand-soft text-brand" : "bg-danger-soft text-danger"
      }`}
    >
      {text}
    </p>
  );
}

function SpecialtyPicker({
  value,
  onChange,
}: {
  value: Specialty[];
  onChange: (next: Specialty[]) => void;
}) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-2">
      {SPECIALTIES.map((s) => {
        const on = value.includes(s);
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(on ? value.filter((v) => v !== s) : [...value, s])}
            className={`rounded-full px-3.5 py-2 text-[13px] font-bold ${
              on ? "bg-brand text-white" : "bg-page text-ink2"
            }`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

function ProfileSection() {
  const { me, updateProfile, loading } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(me?.name ?? "");
  const [title, setTitle] = useState(me?.title ?? "");
  const [phone, setPhone] = useState(me?.phone ?? "");
  const [specialties, setSpecialties] = useState<Specialty[]>(
    (me?.specialty as Specialty[]) ?? []
  );
  const [msg, setMsg] = useState<{ tone: "ok" | "danger"; text: string } | null>(null);

  if (!me) return null;

  return (
    <Section title="프로필">
      <div className="flex items-center gap-3">
        <Avatar member={me} size={44} />
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-bold">{me.name}</div>
          <div className="mt-0.5 text-xs text-sub">
            {me.title} · {me.email}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            setMsg(null);
          }}
          className="flex items-center gap-1 rounded-full bg-page px-3.5 py-2 text-[13px] font-bold text-ink2"
        >
          수정
          <ChevronIcon
            className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90" : ""}`}
            strokeWidth={2.6}
          />
        </button>
      </div>

      {open && (
        <form
          className="mt-4 space-y-3 border-t border-page pt-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setMsg(null);
            try {
              await updateProfile({ name, title, phone, specialties });
              setMsg({ tone: "ok", text: "프로필을 저장했습니다." });
              setOpen(false);
            } catch (err) {
              setMsg({
                tone: "danger",
                text: err instanceof Error ? err.message : "저장에 실패했습니다.",
              });
            }
          }}
        >
          <label className="block">
            <span className={label}>이름</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className={field} />
          </label>
          <label className="block">
            <span className={label}>직함</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
          </label>
          <label className="block">
            <span className={label}>연락처</span>
            <input
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={field}
            />
          </label>
          <div>
            <span className={label}>전문 분야</span>
            <SpecialtyPicker value={specialties} onChange={setSpecialties} />
          </div>
          <button type="submit" disabled={loading} className={primaryBtn}>
            저장
          </button>
        </form>
      )}
      {msg && <Notice tone={msg.tone} text={msg.text} />}
    </Section>
  );
}

function PasswordSection() {
  const { changePassword, loading } = useApp();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState<{ tone: "ok" | "danger"; text: string } | null>(null);

  return (
    <Section title="비밀번호 변경" delay={60}>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setMsg(null);
          try {
            await changePassword(current, next);
            setCurrent("");
            setNext("");
            setMsg({ tone: "ok", text: "비밀번호를 변경했습니다." });
          } catch (err) {
            setMsg({
              tone: "danger",
              text: err instanceof Error ? err.message : "변경에 실패했습니다.",
            });
          }
        }}
      >
        <label className="block">
          <span className={label}>현재 비밀번호</span>
          <input
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
            className={field}
          />
        </label>
        <label className="block">
          <span className={label}>새 비밀번호 (8자 이상)</span>
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
            className={field}
          />
        </label>
        <button type="submit" disabled={loading} className={primaryBtn}>
          변경하기
        </button>
      </form>
      {msg && <Notice tone={msg.tone} text={msg.text} />}
    </Section>
  );
}

function TeamSection() {
  const { me, techs, addMember, removeMember, loadOf, loading } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("시설팀");
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [msg, setMsg] = useState<{ tone: "ok" | "danger"; text: string } | null>(null);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  if (me?.role !== "manager") return null;

  return (
    <Section title="팀원 관리" delay={120}>
      <div className="space-y-1">
        {techs.length === 0 && (
          <p className="py-2 text-[13px] text-sub">아직 등록된 팀원이 없습니다.</p>
        )}
        {techs.map((t) => (
          <div key={t.id} className="flex items-center gap-3 py-2">
            <Avatar member={t} size={36} />
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold">{t.name}</div>
              <div className="mt-0.5 text-xs text-sub">
                {t.title} · 진행 {loadOf(t.id)}건
              </div>
            </div>
            {removeTarget === t.id ? (
              <span className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    try {
                      await removeMember(t.id);
                      setMsg({ tone: "ok", text: `${t.name} 계정을 삭제했습니다.` });
                    } catch (err) {
                      setMsg({
                        tone: "danger",
                        text: err instanceof Error ? err.message : "삭제에 실패했습니다.",
                      });
                    } finally {
                      setRemoveTarget(null);
                    }
                  }}
                  className="rounded-full bg-danger-soft px-3 py-1.5 text-[12px] font-bold text-danger"
                >
                  삭제 확정
                </button>
                <button
                  type="button"
                  onClick={() => setRemoveTarget(null)}
                  className="rounded-full bg-page px-3 py-1.5 text-[12px] font-bold text-ink2"
                >
                  취소
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setRemoveTarget(t.id)}
                className="shrink-0 rounded-full bg-page px-3 py-1.5 text-[12px] font-bold text-sub"
              >
                삭제
              </button>
            )}
          </div>
        ))}
      </div>

      {open ? (
        <form
          className="mt-3 space-y-3 border-t border-page pt-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setMsg(null);
            try {
              await addMember({ name, email, password, title, specialties });
              setName("");
              setEmail("");
              setPassword("");
              setSpecialties([]);
              setOpen(false);
              setMsg({ tone: "ok", text: "팀원 계정을 만들었습니다. 이메일과 비밀번호를 전달해 주세요." });
            } catch (err) {
              setMsg({
                tone: "danger",
                text: err instanceof Error ? err.message : "등록에 실패했습니다.",
              });
            }
          }}
        >
          <label className="block">
            <span className={label}>이름</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required className={field} />
          </label>
          <label className="block">
            <span className={label}>이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={field}
            />
          </label>
          <label className="block">
            <span className={label}>초기 비밀번호 (8자 이상)</span>
            <input
              type="text"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={field}
            />
          </label>
          <label className="block">
            <span className={label}>직함</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
          </label>
          <div>
            <span className={label}>전문 분야 (1개 이상)</span>
            <SpecialtyPicker value={specialties} onChange={setSpecialties} />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className={primaryBtn}>
              등록
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-xl bg-page py-3 text-[14px] font-bold text-ink2"
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setMsg(null);
          }}
          className="mt-3 w-full rounded-xl bg-page py-3 text-[13px] font-bold text-ink2 active:scale-[0.98]"
        >
          + 팀원 등록
        </button>
      )}
      {msg && <Notice tone={msg.tone} text={msg.text} />}
    </Section>
  );
}

function DangerSection() {
  const { me, deleteAccount, loading } = useApp();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isManager = me?.role === "manager";

  return (
    <Section title="계정 탈퇴" delay={180}>
      <p className="text-[13px] leading-relaxed text-sub">
        {isManager
          ? "관리소장 탈퇴는 빌딩 전체 데이터(팀원 계정, 작업, 민원, 결제 이력)를 함께 삭제합니다. 되돌릴 수 없습니다."
          : "내 계정과 로그인 정보가 삭제됩니다. 배정받았던 작업은 미배정으로 돌아갑니다."}
      </p>

      {open ? (
        <form
          className="mt-4 space-y-3 border-t border-page pt-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            if (confirm !== "탈퇴") {
              setError("확인 문구로 '탈퇴'를 입력해 주세요.");
              return;
            }
            try {
              await deleteAccount(password);
              router.replace("/login");
            } catch (err) {
              setError(err instanceof Error ? err.message : "탈퇴에 실패했습니다.");
            }
          }}
        >
          <label className="block">
            <span className={label}>비밀번호</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={field}
            />
          </label>
          <label className="block">
            <span className={label}>확인 문구 — “탈퇴”를 입력하세요</span>
            <input value={confirm} onChange={(e) => setConfirm(e.target.value)} required className={field} />
          </label>
          {error && <Notice tone="danger" text={error} />}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-danger py-3 text-[14px] font-bold text-white disabled:opacity-40"
            >
              영구 삭제
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-xl bg-page py-3 text-[14px] font-bold text-ink2"
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3.5 w-full rounded-xl bg-danger-soft py-3 text-[13px] font-bold text-danger active:scale-[0.98]"
        >
          탈퇴 진행
        </button>
      )}
    </Section>
  );
}

export default function AccountPage() {
  return (
    <div className="md:max-w-2xl">
      <h1 className="mt-3 text-[24px] font-extrabold tracking-[-0.02em]">계정 관리</h1>
      <ProfileSection />
      <PasswordSection />
      <TeamSection />
      <DangerSection />
    </div>
  );
}
