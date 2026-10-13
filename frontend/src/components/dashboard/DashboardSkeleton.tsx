
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

export default function DashboardSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6"
      role="status"
      aria-label="Loading dashboard"
    >
      <div className="space-y-6 pt-2.5 sm:pt-3 animate-pulse">
        {/* Greeting + Stats */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Greeting */}
          <div className="flex flex-col justify-end py-3 lg:col-span-7">
            <div className="flex items-center gap-2">
              <SkeletonLine className="h-4 w-4" />
              <SkeletonLine className="h-3 w-36" />
            </div>

            <SkeletonLine className="mt-3 h-9 w-72 max-w-full" />

            <SkeletonLine className="mt-3 h-4 w-64 max-w-full" />
          </div>

          {/* Stats */}
          <div className="lg:col-span-5">
            <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 sm:mt-3 sm:px-5 sm:py-3.5">
              <div className="grid grid-cols-3 items-center">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className={`relative flex flex-col items-center justify-center ${
                      index !== 2
                        ? "after:absolute after:right-0 after:h-9 after:w-px after:bg-white/10"
                        : ""
                    }`}
                  >
                    <SkeletonLine className="mb-1.5 h-3 w-3" />
                    <SkeletonLine className="h-6 w-10" />
                    <SkeletonLine className="mt-1.5 h-3 w-14" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Bento */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Plan Hero */}
          <div className="lg:col-span-8">
            <div className="relative min-h-[340px] overflow-hidden rounded-xl border border-white/10 bg-[#070B18]">
              <div className="absolute inset-0 bg-white/[0.06]" />

              <div className="absolute inset-0 bg-gradient-to-t from-[#070B18] via-[#070B18]/65 to-[#070B18]/10" />

              <div className="relative z-10 flex min-h-[340px] flex-col justify-end p-5 sm:p-6 lg:p-7">
                <SkeletonLine className="h-6 w-40 rounded-full" />

                <SkeletonLine className="mt-4 h-7 w-64 max-w-full" />

                <SkeletonLine className="mt-3 h-3 w-full max-w-md" />

                <SkeletonLine className="mt-2 h-3 w-4/5 max-w-sm" />

                <SkeletonLine className="mt-5 h-10 w-40 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Upcoming Trip */}
          <div className="lg:col-span-4">
            <div className="flex h-full min-h-[340px] flex-col rounded-xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <SkeletonLine className="h-3 w-16" />

                  <SkeletonLine className="mt-3 h-6 w-32" />
                </div>

                <SkeletonLine className="h-6 w-20 rounded-full" />
              </div>

              <SkeletonLine className="mt-3 h-3 w-56 max-w-full" />

              <div className="mt-6 space-y-0">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between gap-4 py-3 ${
                      index !== 2
                        ? "border-b border-white/[0.07]"
                        : ""
                    }`}
                  >
                    <SkeletonLine className="h-3 w-20" />

                    <SkeletonLine className="h-3 w-24" />
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <SkeletonLine className="h-3 w-24" />

                  <SkeletonLine className="h-3 w-8" />
                </div>

                <SkeletonLine className="mt-2 h-1.5 w-full rounded-full" />
              </div>

              <div className="mt-auto pt-5">
                <SkeletonLine className="h-9 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Row */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Agent Activity */}
          <div className="lg:col-span-4">
            <div className="h-full rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <SkeletonLine className="h-5 w-36" />

                <SkeletonLine className="h-3 w-12" />
              </div>

              <div className="mt-5 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <SkeletonLine className="h-8 w-8 shrink-0 rounded-full" />

                    <div className="min-w-0 flex-1">
                      <SkeletonLine className="h-4 w-44 max-w-full" />

                      <SkeletonLine className="mt-2 h-3 w-36 max-w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="lg:col-span-8">
            <div className="relative min-h-[250px] overflow-hidden rounded-xl border border-white/10 bg-[#070B18]">
              <div className="grid min-h-[250px] grid-cols-1 sm:grid-cols-2">
                <div className="relative z-10 flex flex-col justify-center p-5 sm:p-6">
                  <div className="flex items-center gap-1.5">
                    <SkeletonLine className="h-3 w-3" />

                    <SkeletonLine className="h-3 w-32" />
                  </div>

                  <SkeletonLine className="mt-3 h-6 w-52 max-w-full" />

                  <SkeletonLine className="mt-3 h-3 w-full" />

                  <SkeletonLine className="mt-2 h-3 w-4/5" />

                  <SkeletonLine className="mt-5 h-4 w-36" />
                </div>

                <div className="relative min-h-[210px] bg-white/[0.06] sm:min-h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#070B18] via-[#070B18]/25 to-transparent sm:from-[#070B18]/80" />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#070B18]/60 to-transparent sm:hidden" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}