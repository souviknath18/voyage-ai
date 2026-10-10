function SkeletonBar({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded bg-white/10 ${className}`}
      style={style}
    />
  );
}

export default function TripMapSkeleton() {
  return (
    <div
      className="space-y-5 animate-pulse"
      role="status"
      aria-label="Loading trip map"
    >
      {/* Header and day selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <SkeletonBar className="h-6 w-32" />
          <SkeletonBar className="h-4 w-72 max-w-full" />
        </div>

        <div className="flex w-full flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-[#070B18]/70 p-1 sm:w-auto sm:rounded-full">
          {[48, 68, 68, 68].map((width, index) => (
            <SkeletonBar
              key={index}
              className="h-8 shrink-0 rounded-full"
              style={{ width }}
            />
          ))}
        </div>
      </div>

      {/* Main workspace */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Itinerary panel */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#070B18]/80 lg:h-[650px]">
            <div className="space-y-3 border-b border-white/10 p-4">
              <SkeletonBar className="h-5 w-36" />
              <SkeletonBar className="h-3 w-48 max-w-full" />
            </div>

            <div className="space-y-5 p-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                  <SkeletonBar className="h-9 w-9 shrink-0 rounded-full" />

                  <div className="flex-1 space-y-2">
                    <SkeletonBar className="h-4 w-4/5" />
                    <SkeletonBar className="h-3 w-3/5" />
                    <SkeletonBar className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map canvas */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="relative h-[520px] overflow-hidden rounded-xl border border-white/10 bg-[#101827] lg:h-[650px]">
            {/* Subtle dark overlay */}
            <div className="absolute inset-0 bg-white/[0.02]" />

            {/* Map control placeholders */}
            <div className="absolute left-6 top-6 h-10 w-10 rounded-lg bg-white/[0.06]" />

            <div className="absolute right-6 top-6 h-10 w-10 rounded-lg bg-white/[0.06]" />

            {/* Map attribution placeholder */}
            <div className="absolute bottom-6 left-6 h-5 w-36 rounded bg-white/[0.06]" />
          </div>
        </div>
      </div>

      {/* Route optimization */}
      <div className="flex justify-center pt-1">
        <SkeletonBar className="h-11 w-48 rounded-xl" />
      </div>
    </div>
  );
}