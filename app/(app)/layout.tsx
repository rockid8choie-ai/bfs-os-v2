import BottomTabs from "@/components/BottomTabs";
import Fab from "@/components/Fab";
import Sheets from "@/components/Sheets";
import SideNav from "@/components/SideNav";
import TopBar from "@/components/TopBar";

export default function AppShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 모바일: 풀스크린 + 바텀 탭 / 데스크톱(md+): 좌측 사이드바 + 와이드 콘텐츠
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-page md:max-w-none md:flex-row">
      <SideNav />
      <div className="flex min-h-dvh w-full min-w-0 flex-col md:flex-1">
        <TopBar />
        <main className="w-full flex-1 px-4 pb-28 pt-3 md:mx-auto md:max-w-4xl md:px-10 md:pb-16 md:pt-6">
          {children}
        </main>
      </div>
      <Fab />
      <Sheets />
      <BottomTabs />
    </div>
  );
}
