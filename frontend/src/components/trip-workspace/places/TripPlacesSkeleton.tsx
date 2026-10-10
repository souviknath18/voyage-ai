function SkeletonBar({
  className = "",
}: {
  className?: string;
}) {
  return <div className={`bg-white/10 ${className}`} />;
}

function PlaceCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      {/* Image with overlays */}
      <div className="relative h-44 bg-white/10">
        <SkeletonBar className="absolute left-3 top-3 h-6 w-16 rounded-full" />
        <SkeletonBar className="absolute right-3 top-3 h-8 w-8 rounded-full" />
      </div>

      {/* Card content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <SkeletonBar className="h-5 w-4/5 rounded" />
            <SkeletonBar className="h-3 w-3/5 rounded" />
          </div>
          <SkeletonBar className="h-6 w-20 rounded-md" />
        </div>

        <div className="mt-4 space-y-2">
          <SkeletonBar className="h-3 w-full rounded" />
          <SkeletonBar className="h-3 w-4/5 rounded" />
        </div>

        <div className="mt-4 flex gap-4">
          <SkeletonBar className="h-3 w-16 rounded" />
          <SkeletonBar className="h-3 w-14 rounded" />
        </div>

        <div className="mt-auto pt-5">
          <SkeletonBar className="h-9 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function TripPlacesSkeleton() {
  return (
    <div
      className="space-y-5 animate-pulse"
      role="status"
      aria-label="Loading trip places"
    >
      {/* Header */}
      <div>
        <SkeletonBar className="h-6 w-44 rounded" />
        <SkeletonBar className="mt-2 h-4 w-full max-w-md rounded" />
      </div>

      {/* One full-width summary card */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <SkeletonBar className="h-3 w-24 rounded" />
              <SkeletonBar className="mt-3 h-6 w-20 rounded" />
            </div>
          ))}
        </div>

        <SkeletonBar className="mt-4 h-1.5 w-full rounded-full" />
      </div>

      {/* Eight category filters */}
      <div className="flex flex-wrap gap-2">
        {[42, 80, 54, 66, 86, 80, 62, 60].map(
          (width, index) => (
            <div
              key={index}
              className="h-8 shrink-0 rounded-full bg-white/10"
              style={{ width }}
            />
          ),
        )}
      </div>

      {/* Three-column place grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <PlaceCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}