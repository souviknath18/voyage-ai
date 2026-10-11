"use client";

import FlightResultsSkeleton from "./FlightResultsSkeleton";

function Placeholder({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-md bg-white/10 ${className}`}
    />
  );
}

export default function FlightPageSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6"
      role="status"
      aria-label="Loading flight comparison"
    >
      <div className="space-y-5 pt-2.5 sm:pt-3">
        {/* Header placeholder */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="space-y-4">
            <Placeholder className="h-4 w-28" />
            <Placeholder className="h-8 w-64 max-w-full" />

            <div className="flex flex-wrap gap-4">
              <Placeholder className="h-5 w-32" />
              <Placeholder className="h-5 w-28" />
              <Placeholder className="h-5 w-24" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          {/* Filters placeholder */}
          <aside className="xl:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Placeholder className="mb-6 h-5 w-24" />

              <div className="space-y-5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3"
                  >
                    <Placeholder className="h-4 w-4" />
                    <Placeholder className="h-4 w-28" />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Flight results */}
          <div className="space-y-4 xl:col-span-9">
            {/* AI refinement placeholder */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Placeholder className="mb-4 h-5 w-36" />
              <Placeholder className="h-11 w-full" />
            </div>

            <div className="flex items-center justify-between gap-4 py-2">
              <div className="space-y-3">
                {/* Available Flights title skeleton */}
                <Placeholder className="h-5 w-36" />

                {/* Description skeleton */}
                <Placeholder className="h-3 w-56 max-w-full" />
              </div>

              {/* Refresh button skeleton */}
              <Placeholder className="h-9 w-28" />
            </div>

            <FlightResultsSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}