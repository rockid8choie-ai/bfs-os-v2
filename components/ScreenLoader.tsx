export default function ScreenLoader({ label = "불러오는 중" }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6">
      <span className="ptr-spin h-8 w-8 rounded-full border-2 border-line border-t-brand" />
      <p className="text-[13px] font-semibold text-sub">{label}</p>
      <div className="mt-4 w-full max-w-sm space-y-2">
        <div className="h-16 rounded-2xl bg-card" />
        <div className="h-16 rounded-2xl bg-card" />
        <div className="h-16 rounded-2xl bg-card" />
      </div>
    </div>
  );
}
