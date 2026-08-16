import {
  Card,
} from "@/components/ui";

export default function TripCardSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="h-40 animate-pulse bg-white/[0.05] sm:h-44" />

      <div className="space-y-4 p-4 sm:p-5">
        <div className="h-3 w-1/3 animate-pulse rounded bg-white/[0.06]" />

        <div className="h-5 w-3/4 animate-pulse rounded bg-white/[0.06]" />

        <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.06]" />

        <div className="border-t border-white/10 pt-4">
          <div className="flex justify-between">
            <div className="h-8 w-20 animate-pulse rounded bg-white/[0.06]" />

            <div className="h-8 w-8 animate-pulse rounded-full bg-white/[0.06]" />
          </div>
        </div>

        <div className="h-9 w-full animate-pulse rounded-lg bg-white/[0.06]" />
      </div>
    </Card>
  );
}