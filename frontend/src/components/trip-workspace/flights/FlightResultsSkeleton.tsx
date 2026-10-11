"use client";

export default function FlightResultsSkeleton() {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-label="Refreshing flight options"
      aria-live="polite"
    >
      <span className="sr-only">
        Refreshing flight options...
      </span>

      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="h-5 w-28 rounded-md bg-white/10" />
            <div className="h-6 w-20 rounded-full bg-white/10" />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-6 w-20 rounded-md bg-white/10" />
              <div className="h-4 w-14 rounded-md bg-white/10" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="h-px w-full bg-white/10" />
              <div className="mx-auto h-3 w-24 rounded bg-white/10" />
            </div>

            <div className="space-y-2">
              <div className="h-6 w-20 rounded-md bg-white/10" />
              <div className="h-4 w-14 rounded-md bg-white/10" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="h-7 w-28 rounded-md bg-white/10" />
            <div className="h-9 w-24 rounded-lg bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}