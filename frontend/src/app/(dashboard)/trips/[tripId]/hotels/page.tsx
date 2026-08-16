"use client";

import {
  useRouter,
} from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";

import HotelComparison from "@/components/trip-workspace/hotels/HotelComparison";

import {
  mockTrip,
} from "@/data/mock-trip";

export default function HotelComparisonPage() {
  const router =
    useRouter();

  const trip =
    mockTrip;

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="pt-2.5 sm:pt-3">
          <HotelComparison
            trip={trip}
            onBackAction={() =>
              router.push(
                `/trips/${trip.id}`,
              )
            }
          />
        </div>
      </div>
    </AppLayout>
  );
}