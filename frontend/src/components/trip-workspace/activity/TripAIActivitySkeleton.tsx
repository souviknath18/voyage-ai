import { Card } from "@/components/ui";

function SkeletonBar({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`rounded bg-white/10 ${className}`}
    />
  );
}

function WorkflowItemSkeleton({
  last = false,
}: {
  last?: boolean;
}) {
  return (
    <div className="relative flex gap-3 sm:gap-4">
      {/* Timeline indicator */}
      <div className="relative flex shrink-0 flex-col items-center">
        <SkeletonBar className="relative z-10 h-9 w-9 rounded-full" />

        {!last && (
          <div className="absolute bottom-0 left-1/2 top-9 w-px -translate-x-1/2 bg-white/10" />
        )}
      </div>

      {/* Event card */}
      <div className="mb-5 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 gap-3">
            <SkeletonBar className="mt-0.5 h-4 w-4 shrink-0" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <SkeletonBar className="h-4 w-32 max-w-full" />
                <SkeletonBar className="h-5 w-16 rounded-md" />
              </div>

              <SkeletonBar className="h-3 w-full max-w-md" />
              <SkeletonBar className="h-3 w-3/4 max-w-sm" />

              <SkeletonBar className="h-6 w-28 rounded-md" />
            </div>
          </div>

          <SkeletonBar className="h-3 w-10 shrink-0" />
        </div>
      </div>
    </div>
  );
}

export default function TripAIActivitySkeleton() {
  return (
    <div
      className="space-y-5 animate-pulse"
      role="status"
      aria-label="Loading AI activity"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <SkeletonBar className="h-5 w-5 rounded-md" />
            <SkeletonBar className="h-6 w-28" />
          </div>

          <SkeletonBar className="mt-3 h-4 w-full max-w-md" />
        </div>

        {/* Agent status */}
        <SkeletonBar className="h-8 w-32 rounded-full" />
      </div>

      {/* Summary */}
      <Card className="p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <div className="flex items-center gap-1.5">
                <SkeletonBar className="h-3 w-3" />
                <SkeletonBar className="h-3 w-16" />
              </div>

              <SkeletonBar className="mt-2 h-5 w-24 max-w-full" />
            </div>
          ))}
        </div>

        {/* Workflow progress */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between">
            <SkeletonBar className="h-3 w-36" />
            <SkeletonBar className="h-3 w-9" />
          </div>

          <SkeletonBar className="h-1.5 w-full rounded-full" />
        </div>
      </Card>

      {/* Agent workflow */}
      <Card className="p-4 sm:p-5">
        <div className="mb-5 flex items-center gap-2 border-b border-white/10 pb-4">
          <SkeletonBar className="h-5 w-5 shrink-0" />

          <div className="flex-1 space-y-2">
            <SkeletonBar className="h-5 w-36" />
            <SkeletonBar className="h-3 w-full max-w-md" />
          </div>
        </div>

        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            <WorkflowItemSkeleton
              key={index}
              last={index === 4}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}