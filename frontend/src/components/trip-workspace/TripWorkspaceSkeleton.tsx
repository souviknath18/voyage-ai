export default function TripWorkspaceSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
      <div className="space-y-5 pt-2.5 sm:pt-3 animate-pulse">
        {/* Trip hero */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="h-48 bg-white/10 sm:h-64" />

          <div className="space-y-4 p-5">
            <div className="h-7 w-2/3 rounded-lg bg-white/10" />

            <div className="flex flex-wrap gap-3">
              <div className="h-5 w-36 rounded bg-white/10" />
              <div className="h-5 w-24 rounded bg-white/10" />
              <div className="h-5 w-28 rounded bg-white/10" />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <div className="h-9 w-28 rounded-lg bg-white/10" />
              <div className="h-9 w-28 rounded-lg bg-white/10" />
              <div className="h-9 w-28 rounded-lg bg-white/10" />
            </div>
          </div>
        </div>

        {/* Workspace tabs */}
        <div className="flex gap-5 overflow-hidden border-b border-white/10 pb-4">
          {[88, 80, 70, 70, 55, 90].map((width, index) => (
            <div
              key={index}
              className="h-5 shrink-0 rounded bg-white/10"
              style={{ width }}
            />
          ))}
        </div>

        {/* Initial workspace content */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="h-56 rounded-2xl border border-white/10 bg-white/5 lg:col-span-2" />
          <div className="h-56 rounded-2xl border border-white/10 bg-white/5" />
        </div>
      </div>
    </div>
  );
}