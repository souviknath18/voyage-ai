function SkeletonCard({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-xl border border-white/10 bg-white/[0.03] p-5 ${className}`}
    >
      <div className="mb-5 h-5 w-2/5 rounded bg-white/10" />

      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-white/10" />
        <div className="h-4 w-4/5 rounded bg-white/10" />
        <div className="h-4 w-3/5 rounded bg-white/10" />
      </div>

      <div className="mt-6 h-9 w-28 rounded-lg bg-white/10" />
    </div>
  );
}

export default function TripOverviewSkeleton() {
  return (
    <div className="space-y-5">
      {/* AI Summary + Warnings */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <SkeletonCard className="min-h-[180px] lg:col-span-8" />
        <SkeletonCard className="min-h-[180px] lg:col-span-4" />
      </div>

      {/* Flight + Hotel + Weather */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <SkeletonCard className="min-h-[260px] lg:col-span-5" />
        <SkeletonCard className="min-h-[260px] lg:col-span-5" />
        <SkeletonCard className="min-h-[260px] lg:col-span-2" />
      </div>

      {/* Budget + Highlights */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SkeletonCard className="min-h-[220px]" />
        <SkeletonCard className="min-h-[220px]" />
      </div>

      {/* Optimization */}
      <SkeletonCard className="min-h-[120px]" />
    </div>
  );
}