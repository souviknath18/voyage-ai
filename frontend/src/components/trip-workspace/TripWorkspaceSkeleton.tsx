
function SkeletonLine({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`rounded-md bg-white/10 ${className}`}
    />
  );
}

export default function TripWorkspaceSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6"
      role="status"
      aria-label="Loading trip workspace"
    >
      <div className="space-y-5 pt-2.5 sm:pt-3 animate-pulse">
        {/* Trip hero — matches TripWorkspaceHero */}
        <section className="relative min-h-[300px] overflow-hidden rounded-xl border border-white/10 bg-[#070B18]">
          {/* Background image placeholder */}
          <div className="absolute inset-0 bg-white/10" />

          {/* Same dark gradient as actual hero */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B18] via-[#070B18]/55 to-[#070B18]/10" />

          {/* Bottom-aligned content */}
          <div className="relative z-10 flex min-h-[300px] flex-col justify-end p-4 sm:p-5 lg:p-6">

            {/* Status, travelers, dates */}
            <div className="flex flex-wrap items-center gap-2.5">
              <SkeletonLine className="h-7 w-28 rounded-lg" />
              <SkeletonLine className="h-4 w-24" />
              <SkeletonLine className="h-4 w-48" />
            </div>

            {/* Route + budget summary */}
            <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 space-y-3">
                <SkeletonLine className="h-3 w-20" />

                <SkeletonLine className="h-9 w-80 max-w-full" />

                <SkeletonLine className="h-4 w-64 max-w-full" />
              </div>

              {/* Budget panel */}
              <div className="grid w-full grid-cols-3 gap-2 rounded-xl border border-white/10 bg-[#070B18]/75 p-3 sm:w-auto sm:min-w-[360px] sm:gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <SkeletonLine className="h-3 w-14 max-w-full" />
                    <SkeletonLine className="h-5 w-24 max-w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-5 flex flex-wrap gap-2">
              <SkeletonLine className="h-9 w-32 rounded-lg" />
              <SkeletonLine className="h-9 w-32 rounded-lg" />
              <SkeletonLine className="h-9 w-20 rounded-lg" />
              <SkeletonLine className="h-9 w-20 rounded-lg" />
            </div>
          </div>
        </section>

        {/* Workspace tabs */}
        <div className="flex gap-5 overflow-hidden border-b border-white/10 pb-4">
          {[96, 88, 80, 80, 65, 100].map((width, index) => (
            <div
              key={index}
              className="h-5 shrink-0 rounded-md bg-white/10"
              style={{ width }}
            />
          ))}
        </div>

        {/* Initial overview content */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="h-28 rounded-2xl border border-white/10 bg-white/[0.03] lg:col-span-8" />
          <div className="h-28 rounded-2xl border border-white/10 bg-white/[0.03] lg:col-span-4" />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="h-56 rounded-2xl border border-white/10 bg-white/[0.03] lg:col-span-5" />
          <div className="h-56 rounded-2xl border border-white/10 bg-white/[0.03] lg:col-span-5" />
          <div className="h-56 rounded-2xl border border-white/10 bg-white/[0.03] lg:col-span-2" />
        </div>
      </div>
    </div>
  );
}
