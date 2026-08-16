import {
  notFound,
} from "next/navigation";

import SharedTripCTA from "@/components/shared-trip/SharedTripCTA";
import SharedTripHero from "@/components/shared-trip/SharedTripHero";
import SharedTripHotelCard from "@/components/shared-trip/SharedTripHotelCard";
import SharedTripTimeline from "@/components/shared-trip/SharedTripTimeline";

import {
  mockSharedTrip,
} from "@/data/mock-shared-trip";

interface SharedTripPageProps {
  params: Promise<{
    shareId: string;
  }>;
}

export default async function SharedTripPage({
  params,
}: SharedTripPageProps) {
  const {
    shareId,
  } = await params;

  /*
   * Later:
   *
   * const trip =
   *   await getSharedTrip(
   *     shareId,
   *   );
   */

  const trip =
    shareId ===
    mockSharedTrip.shareId
      ? mockSharedTrip
      : null;

  if (!trip) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pb-16 pt-20 md:px-6">
      <SharedTripHero
        trip={trip}
      />

      <div className="mt-7 grid grid-cols-1 gap-7 lg:grid-cols-12">
        {/* Journey */}
        <div className="lg:col-span-8">
          <SharedTripTimeline
            days={trip.days}
          />
        </div>

        {/* Right Side */}
        <aside className="space-y-4 lg:col-span-4">
          <div className="lg:sticky lg:top-20">
            <div className="space-y-4">
              <SharedTripHotelCard
                hotel={trip.hotel}
              />

              <SharedTripCTA
                shareId={
                  trip.shareId
                }
              />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}