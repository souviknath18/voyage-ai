
function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-md bg-white/[0.07] ${className}`}
    />
  );
}

export default function ExportPageSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading trip export"
      className="flex min-h-0 w-full flex-col gap-3"
    >
      {/* Back to Trip */}
      <Skeleton className="h-4 w-24" />

      <div className="flex min-h-0 w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0A0F1F] lg:h-[calc(100dvh-8rem)] lg:flex-row">
        {/* Left settings panel */}
        <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-[#0D1324] lg:h-full lg:w-[280px] lg:border-b-0 lg:border-r xl:w-[300px]">
          <div className="space-y-3 border-b border-white/10 px-5 py-5">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-48 max-w-full" />
          </div>

          <div className="min-h-0 flex-1 space-y-5 px-5 py-5">
            <div>
              <Skeleton className="h-3 w-32" />

              <div className="mt-4 space-y-4">
                {Array.from({ length: 4 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >
                      <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-5 w-9 shrink-0 rounded-full" />
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="space-y-4">
              <Skeleton className="h-3 w-36" />

              <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.025] p-3">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-5 w-9 rounded-full" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-4/5" />
            </div>
          </div>

          <div className="space-y-2 border-t border-white/10 bg-[#0A0F1F] px-5 py-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </aside>

        {/* Right PDF preview */}
        <section className="min-h-0 min-w-0 flex-1 overflow-hidden bg-[#080C17] px-3 py-6 sm:px-4 lg:px-5">
          <div className="mx-auto w-full max-w-[1000px] overflow-hidden rounded-xl border border-white/10 bg-[#141218]">
            {/* Destination cover */}
            <Skeleton className="h-48 w-full rounded-none sm:h-60" />

            <div className="space-y-8 p-5 sm:p-7">
              {/* Itinerary */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-44" />
                </div>

                {Array.from({ length: 3 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-white/10 bg-white/[0.025] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-44 max-w-full" />
                          <Skeleton className="h-3 w-28" />
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  ),
                )}
              </section>

              {/* Budget */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-36" />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {Array.from({ length: 3 }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="space-y-3 rounded-lg border border-white/10 bg-white/[0.025] p-3"
                      >
                        <Skeleton className="h-3 w-4/5" />
                        <Skeleton className="h-5 w-2/3" />
                      </div>
                    ),
                  )}
                </div>

                <Skeleton className="h-4 w-48 max-w-full" />

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {Array.from({ length: 6 }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="space-y-3 rounded-lg border border-white/10 bg-white/[0.025] p-3"
                      >
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-5 w-2/3" />
                      </div>
                    ),
                  )}
                </div>
              </section>

              {/* Booking details */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-40" />
                </div>

                <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
                  <Skeleton className="h-4 w-44 max-w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>

      <span className="sr-only">
        Loading your trip export details...
      </span>
    </div>
  );
}