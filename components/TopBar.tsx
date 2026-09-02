"use client";

import Link from "next/link";
import { BellIcon } from "@/components/icons";
import Logo from "@/components/Logo";
import { useApp } from "@/lib/store";

export default function TopBar() {
  const { vocs } = useApp();
  const unread = vocs.filter((v) => v.status === "접수").length;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-page/85 px-5 pb-3 pt-[max(12px,env(safe-area-inset-top))] backdrop-blur-md md:hidden">
      <Link href="/" aria-label="홈">
        <Logo compact />
      </Link>
      <Link
        href="/voc"
        aria-label="민원 알림"
        className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink2 active:bg-card"
      >
        <BellIcon className="h-[22px] w-[22px]" strokeWidth={1.8} />
        {unread > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Link>
    </header>
  );
}
