import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomTabs from "@/components/BottomTabs";
import Fab from "@/components/Fab";
import TopBar from "@/components/TopBar";

export const metadata: Metadata = {
  title: "BFS OS v2 (Beta)",
  description: "폰 하나로 끝내는 빌딩 시설 운영 — 모바일 퍼스트 베타",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e1b30",
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
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full">
        <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-page shadow-xl">
          <TopBar />
          <main className="flex-1 px-4 pb-28 pt-3">{children}</main>
          <Fab />
          <BottomTabs />
        </div>
      </body>
    </html>
  );
}
