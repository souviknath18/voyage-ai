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

function HotelCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#302b3b] bg-[#121421]">
      {/* Hotel image */}
      <Skeleton className="h-48 w-full rounded-none sm:h-52" />

      <div className="space-y-4 p-4">
        {/* Hotel name and address */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>

        {/* Room and pricing */}
        <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <Skeleton className="h-3 w-2/3" />

          <div className="flex items-end justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-3 w-28" />
            </div>

            <div className="space-y-2">
              <Skeleton className="ml-auto h-3 w-20" />
              <Skeleton className="ml-auto h-4 w-28" />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3 py-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-32" />
        </div>

        {/* Select Hotel button */}
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function HotelComparisonSkeleton() {
  return (
    <div
      className="space-y-5"
      role="status"
      aria-label="Loading hotels"
    >
      {/* Back to Trip */}
      <Skeleton className="h-4 w-24" />

      {/* Main accommodation banner */}
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            {/* Accommodation, dates, travelers */}
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-7 w-32 rounded-full" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Destination title */}
            <Skeleton className="h-7 w-72 max-w-full" />

            {/* Nights description */}
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>

          {/* Hotel budget */}
          <div className="rounded-xl border border-white/10 bg-[#070B18]/70 p-3 lg:min-w-[190px]">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-6 w-32" />
          </div>
        </div>
      </section>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Left: Current accommodation and AI insight */}
        <aside className="space-y-4 xl:col-span-3">
          <div className="rounded-xl border border-[#302b3b] bg-[#121421] p-4">
            <Skeleton className="mb-4 h-3 w-40" />

            <div className="flex items-start gap-3">
              <Skeleton className="h-[70px] w-[70px] shrink-0 rounded-lg" />

              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>

            <div className="my-4 border-t border-white/10" />

            <div className="space-y-3">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>

            <div className="my-4 border-t border-white/10" />

            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-6 w-36" />
            <Skeleton className="mt-5 h-10 w-full rounded-lg" />
          </div>

          {/* VoyageAI Insight */}
          <div className="space-y-4 rounded-xl border border-[#fb7185]/20 bg-[#fb7185]/[0.03] p-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </aside>

        {/* Right: Curated alternatives */}
        <div className="xl:col-span-9">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <HotelCardSkeleton />
            <HotelCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}