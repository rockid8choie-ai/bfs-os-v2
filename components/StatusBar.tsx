// 데스크톱 폰 목업 프레임 상단의 iOS풍 상태바 (모바일 실기기에서는 숨김)
export default function StatusBar() {
  return (
    <div className="hidden shrink-0 items-center justify-between px-8 pb-1 pt-3.5 text-[13px] font-semibold md:flex">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 18 12" className="h-3 w-[18px] fill-current">
          <rect x="0" y="8" width="3" height="4" rx="0.8" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
          <rect x="10" y="3" width="3" height="9" rx="0.8" />
          <rect x="15" y="0" width="3" height="12" rx="0.8" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 fill-none stroke-current"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <path d="M12 20h.01" />
          <path d="M5 12.859a10 10 0 0 1 14 0" />
          <path d="M8.5 16.429a5 5 0 0 1 7 0" />
        </svg>
        <svg viewBox="0 0 27 12" className="h-3 w-[27px]">
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="11"
            rx="3"
            className="fill-none stroke-current opacity-40"
          />
          <rect x="2.5" y="2.5" width="15" height="7" rx="1.5" className="fill-current" />
          <path d="M24.5 4v4a2.2 2.2 0 0 0 0-4Z" className="fill-current opacity-40" />
        </svg>
      </div>
    </div>
  );
}
