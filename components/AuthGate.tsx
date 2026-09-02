"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import ScreenLoader from "@/components/ScreenLoader";
import { useApp } from "@/lib/store";

const PUBLIC_APP_PATHS = new Set(["/pricing"]);

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, authenticated } = useApp();
  const publicPage = PUBLIC_APP_PATHS.has(pathname);

  useEffect(() => {
    if (!ready || publicPage || authenticated) return;
    router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [authenticated, pathname, publicPage, ready, router]);

  if (publicPage) return children;
  if (!ready) return <ScreenLoader label="작업 불러오는 중" />;
  if (!authenticated) return <ScreenLoader label="로그인 페이지로 이동" />;
  return children;
}
