import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "BFS OS v2 (Beta)",
  description: "폰 하나로 끝내는 빌딩 시설 운영 — 접수부터 담당자 배정까지",
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
        {/* 앱(폰 프레임)과 랜딩(풀와이드)이 같은 상태를 공유한다 */}
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
