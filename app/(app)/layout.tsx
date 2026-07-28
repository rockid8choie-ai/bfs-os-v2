import BottomTabs from "@/components/BottomTabs";
import Fab from "@/components/Fab";
import Sheets from "@/components/Sheets";
import StatusBar from "@/components/StatusBar";
import TopBar from "@/components/TopBar";

export default function AppShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 모바일: 풀스크린 문서 스크롤 / 데스크톱: 폰 목업 프레임 + 내부 스크롤
    <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-page md:my-6 md:h-[calc(100dvh-3rem)] md:max-h-[920px] md:min-h-0 md:overflow-hidden md:rounded-[48px] md:border-[10px] md:border-[#11141a] md:shadow-2xl">
      <StatusBar />
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col md:overflow-y-auto">
        <TopBar />
        <main className="flex-1 px-4 pb-28 pt-3">{children}</main>
      </div>
      <Fab />
      <Sheets />
      <BottomTabs />
    </div>
  );
}
