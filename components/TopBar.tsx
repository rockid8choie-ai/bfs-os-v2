import Image from "next/image";
import Link from "next/link";
import { BellIcon } from "@/components/icons";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-page/85 px-5 py-3 backdrop-blur-md md:hidden">
      <Link href="/" className="flex items-center gap-2">
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
      <Link
        href="/menu"
        aria-label="알림"
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink2 active:bg-card"
      >
        <BellIcon className="h-[22px] w-[22px]" strokeWidth={1.8} />
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">
          3
        </span>
      </Link>
    </header>
  );
}
