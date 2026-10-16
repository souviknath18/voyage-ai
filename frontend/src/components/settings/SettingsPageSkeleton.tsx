
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

function SectionHeading() {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-5 w-36" />
    </div>
  );
}

function SectionCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
      {children}
    </div>
  );
}

function FieldSkeleton({
  wide = false,
}: {
  wide?: boolean;
}) {
  return (
    <div
      className={`space-y-2 ${
        wide ? "md:col-span-2" : ""
      }`}
    >
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

function NotificationRow() {
  return (
    <div className="flex items-center justify-between gap-5 py-4 first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-36 max-w-full" />
        <Skeleton className="h-3 w-56 max-w-full" />
      </div>

      <Skeleton className="h-6 w-11 shrink-0 rounded-full" />
    </div>
  );
}

export default function SettingsPageSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading your settings"
      className="mx-auto w-full max-w-[1280px] px-4 pb-24 md:px-6"
    >
      <div className="animate-pulse space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 pt-2.5 sm:flex-row sm:items-end sm:justify-between sm:pt-3">
          <div className="space-y-2">
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-4 w-72 max-w-full sm:w-96" />
          </div>

          <Skeleton className="hidden h-10 w-36 rounded-lg sm:block" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          {/* Desktop navigation */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-3">
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                ),
              )}
            </div>
          </aside>

          {/* Settings sections */}
          <div className="min-w-0 space-y-8">
            {/* Profile */}
            <section>
              <SectionHeading />

              <SectionCard>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <Skeleton className="mx-auto h-20 w-20 shrink-0 rounded-full sm:mx-0" />

                  <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 md:grid-cols-2">
                    <FieldSkeleton />
                    <FieldSkeleton />
                    <FieldSkeleton />
                    <FieldSkeleton />
                    <FieldSkeleton wide />
                  </div>
                </div>
              </SectionCard>
            </section>

            {/* Travel preferences */}
            <section>
              <SectionHeading />

              <SectionCard>
                <div className="space-y-6">
                  <div>
                    <Skeleton className="h-3 w-24" />

                    <div className="mt-3 flex flex-wrap gap-2">
                      {Array.from({ length: 3 }).map(
                        (_, index) => (
                          <Skeleton
                            key={index}
                            className="h-9 w-24 rounded-lg"
                          />
                        ),
                      )}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-5">
                    <Skeleton className="h-3 w-40" />

                    <div className="mt-3 flex flex-wrap gap-2">
                      {Array.from({ length: 5 }).map(
                        (_, index) => (
                          <Skeleton
                            key={index}
                            className="h-9 w-24 rounded-lg"
                          />
                        ),
                      )}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-5">
                    <Skeleton className="mb-3 h-3 w-36" />
                    <Skeleton className="h-10 w-full max-w-xs rounded-lg" />
                  </div>
                </div>
              </SectionCard>
            </section>

            {/* Currency and region */}
            <section>
              <SectionHeading />

              <SectionCard>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FieldSkeleton />
                  <FieldSkeleton />
                </div>
              </SectionCard>
            </section>

            {/* Notifications */}
            <section>
              <SectionHeading />

              <SectionCard>
                <div className="divide-y divide-white/10">
                  {Array.from({ length: 6 }).map(
                    (_, index) => (
                      <NotificationRow key={index} />
                    ),
                  )}
                </div>
              </SectionCard>
            </section>

            {/* Privacy and security */}
            <section>
              <SectionHeading />

              <SectionCard>
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3"
                      >
                        <Skeleton className="h-9 w-9 rounded-lg" />

                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-40 max-w-full" />
                          <Skeleton className="h-3 w-56 max-w-full" />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </SectionCard>
            </section>

            {/* Account */}
            <section>
              <SectionHeading />

              <div className="rounded-xl border border-red-400/20 bg-red-400/[0.04] p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-64 max-w-full" />
                  </div>

                  <Skeleton className="h-9 w-32 rounded-lg" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Mobile save button placeholder */}
      <div className="fixed bottom-4 left-4 right-4 z-50 sm:hidden">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}