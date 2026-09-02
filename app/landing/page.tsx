import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertIcon,
  CalendarCheckIcon,
  CheckIcon,
  ChevronIcon,
  MessageIcon,
  SparkIcon,
  UserIcon,
  UsersIcon,
  WrenchIcon,
} from "@/components/icons";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "BFS OS — 빌딩 시설 운영, 폰 하나로",
  description:
    "민원·알람·점검을 한 줄로 접수하면 AI가 분류하고 담당자까지 배정합니다. 관리소장과 시설팀을 위한 빌딩 운영 OS. 지금 무료 체험 중.",
};

const PROBLEMS = [
  {
    Icon: MessageIcon,
    title: "민원은 카톡·전화로 흩어집니다",
    body: "단톡방에 올라온 요청은 스크롤과 함께 사라집니다. 어제 접수된 게 처리됐는지 확인하려면 다시 물어봐야 합니다.",
  },
  {
    Icon: UserIcon,
    title: "누가 하는지는 소장 머릿속에만",
    body: "배정이 기록되지 않으니 중복 출동이 생기고, 한 사람에게 일이 몰려도 티가 나지 않습니다.",
  },
  {
    Icon: CalendarCheckIcon,
    title: "기록이 남지 않습니다",
    body: "법정점검·정기점검 이력을 다시 만들어야 하고, 입주사에 근거를 대기 어렵습니다.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "한 줄로 접수",
    body: "사진 찍고 한 줄만 쓰면 됩니다. 민원·알람·순찰 발견을 구분해 넣을 필요가 없습니다.",
    tag: "누구나 30초",
  },
  {
    n: "02",
    title: "AI가 분류하고 배정",
    body: "유형을 판단해 전문분야가 맞는 담당자에게, 지금 부하가 적은 순서로 배정합니다. 추천 이유도 함께 보여줍니다.",
    tag: "이게 핵심",
  },
  {
    n: "03",
    title: "처리되고 남습니다",
    body: "담당자는 자기 작업만 보고 처리하면 됩니다. 완료 즉시 이력이 쌓이고 리포트로 이어집니다.",
    tag: "다음 달의 근거",
  },
];

const FEATURES = [
  {
    Icon: SparkIcon,
    title: "AI 만능 접수",
    body: "유형을 몰라도 됩니다. 한 줄 쓰면 이슈·민원·작업으로 알아서 갈라집니다.",
  },
  {
    Icon: UsersIcon,
    title: "담당자 배정",
    body: "전문분야와 현재 진행 건수를 함께 보고 배정합니다. 프로필에서 바로 재배정도 됩니다.",
  },
  {
    Icon: WrenchIcon,
    title: "작업 파이프라인",
    body: "접수 → 배정 → 진행 → 완료. 지금 어디에 몇 건이 걸려 있는지 한 화면에서 보입니다.",
  },
  {
    Icon: AlertIcon,
    title: "법정점검 알림",
    body: "소방·승강기·전기 의무 점검을 마감 전에 띄우고, 담당자 지정까지 이어줍니다.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-page">
      {/* 로고는 밝은 배경 위에만 — 진남색 워드마크가 묻히지 않도록 내비는 흰 배경 유지 */}
      <header className="sticky top-0 z-30 border-b border-line bg-page/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <Link
            href="/login"
            className="min-h-[44px] rounded-xl bg-brand px-4 py-2.5 text-[13px] font-bold text-white transition-transform active:scale-95"
          >
            무료로 체험하기
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#191f28] to-[#2c3542] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-24">
          <div>
            <span className="inline-block rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-bold text-white/80">
              관리소장 · 시설팀을 위한 빌딩 운영 OS
            </span>
            <h1 className="mt-5 text-[34px] font-extrabold leading-[1.25] tracking-[-0.03em] md:text-[46px]">
              카톡으로 주고받던 시설 관리,
              <br />
              <span className="text-[#6aa5ff]">폰 하나로</span> 끝냅니다.
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/70 md:text-[17px]">
              민원·알람·순찰 발견을 한 줄로 접수하면, AI가 유형을 분류하고
              <b className="font-bold text-white"> 담당자까지 배정</b>합니다. 소장은
              누가 무엇을 하는지 보고, 시설팀은 자기 일만 보면 됩니다.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
            href="/login"
            className="flex min-h-[48px] items-center gap-1 rounded-2xl bg-white px-6 py-3.5 text-[15px] font-bold text-[#191f28] transition-transform active:scale-95"
          >
                무료로 체험하기
                <ChevronIcon className="h-4 w-4 opacity-50" strokeWidth={2.6} />
              </Link>
              <Link
                href="#flow"
                className="rounded-2xl border border-white/20 px-6 py-3.5 text-[15px] font-bold text-white/90 transition-transform active:scale-95"
              >
                어떻게 도는지 보기
              </Link>
            </div>
            <p className="mt-4 text-[12.5px] text-white/45">
              카드 등록 없이 시작 · 입주사 요청은 언제나 무료
            </p>
          </div>

          {/* 제품이 무엇을 하는지 문장 대신 화면으로 보여주는 미니 목업 */}
          <div className="rounded-[28px] bg-white/[0.06] p-5 ring-1 ring-white/10">
            <div className="rounded-[20px] bg-white p-4 text-ink shadow-2xl">
              <div className="text-[12px] font-bold text-sub">무엇이든 접수</div>
              <div className="mt-2 rounded-xl border border-line px-3 py-2.5 text-[13.5px]">
                3층 화장실 온수가 안 나와요
              </div>

              <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-card px-3 py-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-tint-amber text-tint-amber-fg">
                  <WrenchIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
                </span>
                <span className="text-[12px]">
                  <b className="font-bold text-brand">작업지시 · 배관</b>
                  <span className="text-sub"> 으로 분류됨</span>
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2 rounded-xl bg-brand-soft px-3 py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-bold text-brand">
                  김
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-bold">
                    김태식 <span className="font-medium text-sub">시설팀 · 기계</span>
                  </span>
                  <span className="block text-[11px] font-semibold text-brand">
                    배관·급수 담당 · 현재 1건으로 여유 있음
                  </span>
                </span>
                <SparkIcon className="h-4 w-4 shrink-0 text-brand" strokeWidth={2.2} />
              </div>

              <div className="mt-3 rounded-xl bg-brand py-2.5 text-center text-[13px] font-bold text-white">
                접수하기
              </div>
              <p className="mt-2.5 text-center text-[11px] text-sub">
                접수 한 번에 분류 · 배정 · 알림까지
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 문제 */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className="text-[26px] font-extrabold tracking-[-0.03em] md:text-[34px]">
          빌딩 하나를 돌리는 데
          <br className="md:hidden" /> 필요한 건 시스템인데,
        </h2>
        <p className="mt-3 text-[15px] text-sub md:text-[17px]">
          지금은 대부분 이렇게 일하고 있습니다.
        </p>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="rounded-[20px] bg-card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-page text-danger">
                <p.Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <h3 className="mt-4 text-[16px] font-bold leading-snug">{p.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-sub">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 해결 — 3단계 흐름 */}
      <section id="flow" className="bg-card py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <span className="text-[13px] font-bold text-brand">BFS OS가 하는 일</span>
          <h2 className="mt-2 text-[26px] font-extrabold tracking-[-0.03em] md:text-[34px]">
            접수 → 배정 → 완료.
            <br />이 세 단계만 돌립니다.
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-sub md:text-[17px]">
            기능을 늘리는 대신, 매일 반복되는 하나의 흐름을 끊기지 않게 만들었습니다.
          </p>

          <div className="mt-9 grid gap-3 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-[20px] bg-page p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[24px] font-extrabold tracking-tight text-brand">
                    {s.n}
                  </span>
                  <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand">
                    {s.tag}
                  </span>
                </div>
                <h3 className="mt-3.5 text-[17px] font-bold">{s.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-sub">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-[20px] bg-page p-6">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
              {["접수", "배정", "진행", "완료"].map((label, i, arr) => (
                <span key={label} className="flex items-center gap-2">
                  <span className="rounded-xl bg-card px-4 py-2 text-[13px] font-bold">
                    {label}
                  </span>
                  {i < arr.length - 1 && (
                    <ChevronIcon className="h-4 w-4 text-mute" strokeWidth={3} />
                  )}
                </span>
              ))}
              <span className="ml-auto text-[12.5px] font-semibold text-sub">
                지금 어느 단계에 몇 건이 걸려 있는지 홈에서 바로 보입니다
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 기능 */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <h2 className="text-[26px] font-extrabold tracking-[-0.03em] md:text-[34px]">
          꼭 필요한 것만 전면에
        </h2>
        <p className="mt-3 text-[15px] text-sub md:text-[17px]">
          쓰지 않는 메뉴로 화면을 채우지 않았습니다.
        </p>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4 rounded-[20px] bg-card p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <f.Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <h3 className="text-[16px] font-bold">{f.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-sub">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 대상 */}
      <section className="bg-card py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-[26px] font-extrabold tracking-[-0.03em] md:text-[34px]">
            두 사람을 위해 만들었습니다
          </h2>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <div className="rounded-[20px] bg-page p-7">
              <span className="text-[13px] font-bold text-brand">관리소장</span>
              <h3 className="mt-2 text-[19px] font-extrabold tracking-[-0.02em]">
                누가 무엇을 하고 있는지
                <br />한 화면에서 봅니다
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  "담당 미지정 작업이 먼저 올라옵니다",
                  "부하가 적은 담당자를 추천받아 배정합니다",
                  "이번 주 처리율과 아낀 시간이 자동 집계됩니다",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[13.5px]">
                    <CheckIcon
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                      strokeWidth={3}
                    />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[20px] bg-page p-7">
              <span className="text-[13px] font-bold text-brand">시설팀</span>
              <h3 className="mt-2 text-[19px] font-extrabold tracking-[-0.02em]">
                내 작업만 보고
                <br />처리하면 끝입니다
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  "배정받은 작업만 순서대로 보입니다",
                  "시작·완료를 버튼 하나로 기록합니다",
                  "완료 사진이 그대로 이력으로 남습니다",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[13.5px]">
                    <CheckIcon
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                      strokeWidth={3}
                    />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 무료 체험 */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="rounded-[28px] bg-gradient-to-br from-[#191f28] to-[#2c3542] px-7 py-14 text-center text-white md:px-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-bold text-white/80">
            <SparkIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
            지금은 무료 체험 기간입니다
          </span>
          <h2 className="mt-5 text-[28px] font-extrabold leading-snug tracking-[-0.03em] md:text-[38px]">
            상담 없이, 오늘 바로 시작하세요
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
            카드 등록 없이 모든 기능을 열어두고 있습니다. 빌딩 1개부터 쓰실 수 있고,
            체험 중 쌓인 데이터와 이력은 그대로 유지됩니다.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex min-h-[48px] items-center gap-1 rounded-2xl bg-white px-8 py-4 text-[15px] font-bold text-[#191f28] transition-transform active:scale-95"
          >
            무료로 체험하기
            <ChevronIcon className="h-4 w-4 opacity-50" strokeWidth={2.6} />
          </Link>
          <p className="mt-4 text-[12.5px] text-white/45">
            민원을 넣는 입주사는 언제나 무료입니다
          </p>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8">
          <div className="flex items-center gap-2">
            <Logo compact />
            <span className="text-[12px] text-sub">Building Facility Service</span>
          </div>
          <div className="flex items-center gap-5 text-[12.5px] font-semibold text-sub">
            <Link href="/login">앱 체험</Link>
            <Link href="/pricing">이용 안내</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
