function SkeletonBar({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`rounded bg-white/10 ${className}`}
    />
  );
}

export default function TripItinerarySkeleton() {
  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12 animate-pulse">
      {/* Main itinerary */}
      <div className="space-y-6 lg:col-span-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <SkeletonBar className="h-6 w-52" />
            <SkeletonBar className="h-4 w-full max-w-sm" />
          </div>

          <div className="flex gap-2">
            <SkeletonBar className="h-9 w-28 rounded-lg" />
            <SkeletonBar className="h-9 w-24 rounded-lg" />
          </div>
        </div>

        {/* Day selector */}
        <div className="flex gap-2 overflow-hidden">
          {[1, 2, 3, 4].map((day) => (
            <SkeletonBar
              key={day}
              className="h-9 w-20 shrink-0 rounded-full"
            />
          ))}
        </div>

        {/* Selected day */}
        <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <SkeletonBar className="h-6 w-44" />
          <SkeletonBar className="h-4 w-64 max-w-full" />

          {/* Activities */}
          {[1, 2, 3].map((activity) => (
            <div
              key={activity}
              className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <SkeletonBar className="h-20 w-24 shrink-0 rounded-lg" />

              <div className="flex-1 space-y-3">
                <SkeletonBar className="h-4 w-3/4" />
                <SkeletonBar className="h-3 w-full" />
                <SkeletonBar className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>

        {/* AI prompt */}
        <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <SkeletonBar className="h-5 w-36" />
          <SkeletonBar className="h-20 w-full rounded-lg" />
          <SkeletonBar className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      {/* Map panel */}
      <aside className="hidden lg:col-span-4 lg:block">
        <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <SkeletonBar className="h-5 w-36" />
          <SkeletonBar className="h-[320px] w-full rounded-lg" />
          <SkeletonBar className="h-4 w-3/4" />
        </div>
      </aside>
    </div>
  );
}