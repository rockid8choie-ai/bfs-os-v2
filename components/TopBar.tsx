import Image from "next/image";
import Link from "next/link";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-card px-4 py-3">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/bfs-wordmark.png"
          alt="BFS"
          width={64}
          height={20}
          className="h-5 w-auto"
          priority
        />
        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand">
          OS v2 BETA
        </span>
      </Link>
      <Link
        href="/menu"
        aria-label="알림"
        className="relative rounded-lg p-2 text-xl"
      >
        🔔
        <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
          3
        </span>
      </Link>
    </header>
  );
}
