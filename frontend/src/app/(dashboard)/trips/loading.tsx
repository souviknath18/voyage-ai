import AppLayout from "@/components/layout/AppLayout";
import TripCardSkeleton from "@/components/trips/TripCardSkeleton";

export default function Loading() {
  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="space-y-6">
          <div className="pt-3">
            <h1 className="text-2xl font-semibold">
              My Trips
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Manage your upcoming adventures,
              drafts and past journeys.
            </p>
          </div>

          <div className="h-11 animate-pulse rounded-lg bg-white/5" />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <TripCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}