"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "홈", icon: "🏠" },
  { href: "/work-orders", label: "작업", icon: "🔧" },
  { href: "/voc", label: "민원", icon: "💬" },
  { href: "/menu", label: "전체", icon: "☰" },
];

export default function BottomTabs() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-md border-t border-line bg-page/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      {TABS.map((t) => {
        const active = isActive(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] transition-colors ${
              active ? "font-bold text-ink" : "text-mute"
            }`}
          >
            <span
              className={`text-xl leading-none ${active ? "" : "opacity-45 grayscale"}`}
            >
              {t.icon}
            </span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
