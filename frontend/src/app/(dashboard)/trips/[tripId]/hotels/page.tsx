
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import HotelComparison from "@/components/trip-workspace/hotels/HotelComparison";

import { mockTrip } from "@/data/mock-trip";

import {
  getTrip,
  getTripHotels,
  getSelectedTripHotel,
} from "@/lib/trips";

import {
  mapHotelOfferToOption,
  mapSelectedHotelToOption,
} from "@/lib/hotel-mappers";

import type { TripWorkspaceData } from "@/types/trip-workspace";

export default function HotelComparisonPage() {
  const router = useRouter();
  const params = useParams<{ tripId: string }>();
  const tripId = params.tripId;

  const [trip, setTrip] =
    useState<TripWorkspaceData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHotels() {
      try {
        setLoading(true);
        setError(null);
        setTrip(null);

        const [tripData, hotelsData, selectedHotel] =
          await Promise.all([
            getTrip(tripId),
            getTripHotels(tripId),
            getSelectedTripHotel(tripId),
          ]);

        if (cancelled) return;

        const selectedOfferId =
          selectedHotel?.provider_offer_id ?? null;

        const options = hotelsData.offers.map((offer) =>
          mapHotelOfferToOption(
            offer,
            hotelsData.recommended_hotel_id,
            selectedOfferId,
          ),
        );

        // A saved offer might no longer appear in
        // the latest provider search results.
        if (
          selectedHotel &&
          !options.some((option) => option.current)
        ) {
          options.unshift(
            mapSelectedHotelToOption(selectedHotel),
          );
        }

        if (options.length === 0) {
          setError("No hotels are available for this trip.");
          return;
        }

        const duration = Math.max(
          1,
          Math.round(
            (Date.parse(tripData.end_date) -
              Date.parse(tripData.start_date)) /
              86400000,
          ),
        );

        const workspaceTrip: TripWorkspaceData = {
          ...mockTrip,

          id: tripData.trip_id,
          title: `Trip to ${tripData.destination}`,

          hotelBudget: Number(hotelsData.hotel_budget ?? 0),
          origin: tripData.origin,
          destination: tripData.destination,

          startDate: tripData.start_date,
          endDate: tripData.end_date,
          duration,

          travelers: tripData.travelers,
          currency: tripData.currency,

          totalBudget: Number(tripData.budget ?? 0),
          estimatedCost: Number(
            tripData.estimated_total_cost ?? 0,
          ),
          remainingBudget:
            Number(tripData.budget ?? 0) -
            Number(tripData.estimated_total_cost ?? 0),

          hotelOptions: options,
        };

        setTrip(workspaceTrip);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load hotels:", err);
          setError("Unable to load hotels. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (tripId) {
      void loadHotels();
    }

    return () => {
      cancelled = true;
    };
  }, [tripId]);

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="pt-2.5 sm:pt-3">
          {loading ? (
            <div className="py-12 text-center text-[#948e9c]">
              Loading hotels...
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-red-400">{error}</p>
              <button
                type="button"
                className="mt-4 text-sm text-[#e6e0e8] underline"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          ) : trip ? (
            <HotelComparison
              trip={trip}
              onBackAction={() =>
                router.push(`/trips/${tripId}`)
              }
            />
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
}
