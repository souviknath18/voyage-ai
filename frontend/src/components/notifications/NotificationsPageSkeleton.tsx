
function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`rounded-md bg-white/[0.07] ${className}`}
    />
  );
}

function NotificationCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Notification icon */}
        <Skeleton className="h-11 w-11 shrink-0 rounded-full" />

        {/* Notification content */}
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>

          <Skeleton className="h-4 w-56 max-w-full" />

          <div className="space-y-2">
            <Skeleton className="h-3 w-full max-w-xl" />
            <Skeleton className="h-3 w-3/4 max-w-md" />
          </div>
        </div>

        {/* Notification action */}
        <Skeleton className="h-9 w-24 shrink-0 rounded-lg" />
      </div>
    </div>
  );
}

export default function NotificationsPageSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading notifications"
      className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6"
    >
      <div className="animate-pulse space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 pt-2.5 sm:flex-row sm:items-end sm:justify-between sm:pt-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>

            <Skeleton className="h-4 w-80 max-w-full sm:w-96" />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Skeleton className="h-9 w-full rounded-lg sm:w-44" />
            <Skeleton className="h-9 w-full rounded-lg sm:w-32" />
            <Skeleton className="hidden h-9 w-9 rounded-lg sm:block" />
          </div>
        </div>

        {/* New notifications */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-5" />
          </div>

          {Array.from({ length: 3 }).map((_, index) => (
            <NotificationCardSkeleton key={index} />
          ))}
        </section>

        {/* Earlier notifications */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-5" />
          </div>

          {Array.from({ length: 2 }).map((_, index) => (
            <NotificationCardSkeleton key={index} />
          ))}
        </section>
      </div>
    </div>
  );
}