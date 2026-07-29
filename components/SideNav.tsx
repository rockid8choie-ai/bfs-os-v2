"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellIcon,
  HomeIcon,
  MenuIcon,
  MessageIcon,
  PlusIcon,
  WrenchIcon,
} from "@/components/icons";
import { BUILDING } from "@/lib/mock";
import { useApp } from "@/lib/store";

const NAV = [
  { href: "/", label: "홈", Icon: HomeIcon },
  { href: "/work-orders", label: "작업", Icon: WrenchIcon },
  { href: "/voc", label: "민원", Icon: MessageIcon },
  { href: "/menu", label: "전체", Icon: MenuIcon },
];

/** 데스크톱(md+) 전용 좌측 내비게이션 — 모바일은 BottomTabs가 담당 */
export default function SideNav() {
  const pathname = usePathname();
  const { openIntake } = useApp();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line bg-page px-4 py-6 md:flex">
      <Link href="/" className="flex items-center gap-2 px-2">
        <Image
          src="/bfs-wordmark.png"
          alt="BFS"
          width={64}
          height={20}
          className="logo-knockout h-[18px] w-auto"
          priority
        />
        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand">
          OS v2 BETA
        </span>
      </Link>

      <button
        onClick={openIntake}
        className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand py-3 text-sm font-bold text-white shadow-[0_6px_16px_rgba(49,130,246,0.3)] transition-transform active:scale-[0.98]"
      >
        <PlusIcon className="h-4.5 w-4.5" strokeWidth={2.4} />
        접수하기
      </button>

      <nav className="mt-6 flex flex-col gap-1">
        {NAV.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition-colors ${
                active
                  ? "bg-card font-bold text-ink"
                  : "font-medium text-sub hover:bg-card/60 hover:text-ink2"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
              {label}
            </Link>
          );
        })}
        <Link
          href="/menu"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-sub transition-colors hover:bg-card/60 hover:text-ink2"
        >
          <span className="relative">
            <BellIcon className="h-5 w-5" strokeWidth={1.8} />
            <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-danger px-0.5 text-[8px] font-bold text-white">
              3
            </span>
          </span>
          알림
        </Link>
      </nav>

      <div className="mt-auto rounded-xl bg-card px-3.5 py-3">
        <div className="text-[13px] font-bold">{BUILDING.name}</div>
        <div className="mt-0.5 text-[11px] text-sub">{BUILDING.todayLabel}</div>
      </div>
    </aside>
  );
}
