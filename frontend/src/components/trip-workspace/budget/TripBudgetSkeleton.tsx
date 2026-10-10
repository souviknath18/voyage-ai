function SkeletonBar({
  className = "",
}: {
  className?: string;
}) {
  return <div className={`rounded bg-white/10 ${className}`} />;
}

function SkeletonCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/[0.03] p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export default function TripBudgetSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-5 lg:grid-cols-12 animate-pulse"
      role="status"
      aria-label="Loading trip budget"
    >
      {/* Left column */}
      <div className="space-y-5 lg:col-span-8">
        {/* Budget Overview */}
        <SkeletonCard>
          <SkeletonBar className="h-5 w-40" />

          <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
            <div className="space-y-3">
              <SkeletonBar className="h-3 w-36" />
              <SkeletonBar className="h-9 w-48" />
            </div>

            <div className="flex gap-3">
              <SkeletonBar className="h-14 w-28 rounded-lg" />
              <SkeletonBar className="h-14 w-28 rounded-lg" />
            </div>
          </div>

          <SkeletonBar className="mt-7 h-3 w-36" />
          <SkeletonBar className="mt-3 h-2 w-full rounded-full" />
          <SkeletonBar className="mt-3 h-3 w-64 max-w-full" />
        </SkeletonCard>

        {/* Expense Breakdown */}
        <SkeletonCard>
          <SkeletonBar className="h-5 w-44" />
          <SkeletonBar className="mt-3 h-3 w-72 max-w-full" />

          <div className="mt-6 space-y-5">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-3">
                  <SkeletonBar className="h-8 w-8 rounded-lg" />

                  <div className="flex-1 space-y-2">
                    <SkeletonBar className="h-4 w-28" />
                    <SkeletonBar className="h-3 w-20" />
                  </div>

                  <SkeletonBar className="h-4 w-24" />
                </div>

                <SkeletonBar className="h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>

      {/* Right column */}
      <div className="space-y-3 lg:col-span-4">
        {/* AI Budget Optimization */}
        <SkeletonCard>
          <div className="flex flex-col items-center space-y-4 py-2">
            <SkeletonBar className="h-12 w-12 rounded-full" />
            <SkeletonBar className="h-5 w-48" />
            <SkeletonBar className="h-3 w-full" />
            <SkeletonBar className="h-3 w-4/5" />
            <SkeletonBar className="mt-2 h-10 w-full rounded-lg" />
          </div>
        </SkeletonCard>

        {/* Live Provider Prices */}
        <SkeletonCard>
          <SkeletonBar className="h-5 w-40" />
          <SkeletonBar className="mt-3 h-3 w-full" />
          <SkeletonBar className="mt-2 h-3 w-3/4" />
        </SkeletonCard>

        {/* AI Estimated Costs */}
        <SkeletonCard>
          <SkeletonBar className="h-5 w-40" />
          <SkeletonBar className="mt-3 h-3 w-full" />
          <SkeletonBar className="mt-2 h-3 w-4/5" />
        </SkeletonCard>

        {/* VoyageAI Insight */}
        <SkeletonCard>
          <SkeletonBar className="h-5 w-36" />
          <SkeletonBar className="mt-3 h-3 w-full" />
          <SkeletonBar className="mt-2 h-3 w-4/5" />
          <SkeletonBar className="mt-2 h-3 w-2/3" />
        </SkeletonCard>
      </div>
    </div>
  );
}