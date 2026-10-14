
interface HotelRefinementSkeletonProps {
  count?: number;
}

function HotelSkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121421]">
      {/* Hotel image */}
      <div className="h-48 w-full animate-pulse bg-white/[0.07] sm:h-52" />

      <div className="space-y-4 p-4">
        {/* Hotel name and address */}
        <div className="space-y-2">
          <div className="h-5 w-3/4 animate-pulse rounded-md bg-white/[0.07]" />
          <div className="h-3 w-1/2 animate-pulse rounded-md bg-white/[0.07]" />
        </div>

        {/* Room details and pricing */}
        <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="h-3 w-2/3 animate-pulse rounded-md bg-white/[0.07]" />

          <div className="flex items-end justify-between gap-3">
            <div className="space-y-2">
              <div className="h-6 w-36 animate-pulse rounded-md bg-white/[0.07]" />
              <div className="h-3 w-28 animate-pulse rounded-md bg-white/[0.07]" />
            </div>

            <div className="space-y-2">
              <div className="ml-auto h-3 w-20 animate-pulse rounded-md bg-white/[0.07]" />
              <div className="ml-auto h-4 w-28 animate-pulse rounded-md bg-white/[0.07]" />
            </div>
          </div>
        </div>

        {/* Hotel amenities */}
        <div className="space-y-3 py-2">
          <div className="h-3 w-28 animate-pulse rounded-md bg-white/[0.07]" />
          <div className="h-3 w-36 animate-pulse rounded-md bg-white/[0.07]" />
          <div className="h-3 w-32 animate-pulse rounded-md bg-white/[0.07]" />
        </div>

        {/* Select Hotel button */}
        <div className="h-9 w-full animate-pulse rounded-lg bg-white/[0.07]" />
      </div>
    </div>
  );
}

export default function HotelRefinementSkeleton({
  count = 2,
}: HotelRefinementSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Refining hotel alternatives"
      aria-busy="true"
      className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2"
    >
      <span className="sr-only">
        VoyageAI is refining your hotel alternatives.
      </span>

      {Array.from(
        { length: count },
        (_, index) => (
          <HotelSkeletonCard key={index} />
        ),
      )}
    </div>
  );
}