"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, MenuIcon, MessageIcon, WrenchIcon } from "@/components/icons";

const TABS = [
  { href: "/", label: "홈", Icon: HomeIcon },
  { href: "/work-orders", label: "작업", Icon: WrenchIcon },
  { href: "/voc", label: "민원", Icon: MessageIcon },
  { href: "/menu", label: "전체", Icon: MenuIcon },
];

export default function BottomTabs() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-md border-t border-line bg-page/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      {TABS.map(({ href, label, Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${
              active ? "font-bold text-ink" : "font-medium text-mute"
            }`}
          >
            <Icon className="h-6 w-6" strokeWidth={active ? 2.4 : 1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
