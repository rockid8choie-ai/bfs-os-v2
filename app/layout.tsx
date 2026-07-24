import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomTabs from "@/components/BottomTabs";
import Fab from "@/components/Fab";
import StatusBar from "@/components/StatusBar";
import TopBar from "@/components/TopBar";

export const metadata: Metadata = {
  title: "BFS OS v2 (Beta)",
  description: "폰 하나로 끝내는 빌딩 시설 운영 — 모바일 퍼스트 베타",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3182f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css"
        />
      </head>
      <body className="min-h-full">
        {/* 모바일: 풀스크린 문서 스크롤 / 데스크톱: 폰 목업 프레임 + 내부 스크롤 */}
        <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-page md:my-6 md:h-[calc(100dvh-3rem)] md:max-h-[920px] md:min-h-0 md:overflow-hidden md:rounded-[48px] md:border-[10px] md:border-[#11141a] md:shadow-2xl">
          <StatusBar />
          <div className="no-scrollbar flex min-h-0 flex-1 flex-col md:overflow-y-auto">
            <TopBar />
            <main className="flex-1 px-4 pb-28 pt-3">{children}</main>
          </div>
          <Fab />
          <BottomTabs />
        </div>
      </body>
    </html>
  );
}
