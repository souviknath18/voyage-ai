
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import HotelComparison from "@/components/trip-workspace/hotels/HotelComparison";
import HotelComparisonSkeleton from "@/components/trip-workspace/hotels/HotelComparisonSkeleton";
import { cachedHotelSearch } from "@/lib/hotel-search-cache";
import { dedupeRequest } from "@/lib/request-dedup";

import { mockTrip } from "@/data/mock-trip";

import {
  getTrip,
  getTripHotels,
  getSelectedTripHotel,
  getTripBudget,
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
  
  const [budgetData, setBudgetData] =
    useState<Awaited<ReturnType<typeof getTripBudget>> | null>(null);

  const [hotelOffers, setHotelOffers] =
    useState<Awaited<ReturnType<typeof getTripHotels>> | null>(
      null,
    );

  const budgetVersion = useRef(0);

  const [loading, setLoading] = useState(true);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [budgetReady, setBudgetReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHotels() {
      const currentBudgetVersion = ++budgetVersion.current;
      try {
        setLoading(true);
        setBudgetLoading(true);
        setBudgetReady(false);
        setError(null);
        setTrip(null);
        setBudgetData(null);
        setHotelOffers(null);

        // Budget loads independently from the hotel results.
        void measureRequest(
          "Budget",
          dedupeRequest(
            `budget:${tripId}`,
            () => getTripBudget(tripId),
          ),
        ).then(
          (result) => {
            if (
              cancelled ||
              currentBudgetVersion !== budgetVersion.current
            ) {
              return;
            }

            setBudgetData(result);
            setBudgetReady(true);
            setBudgetLoading(false);
          },
          (budgetError) => {
            if (
              cancelled ||
              currentBudgetVersion !== budgetVersion.current
            ) {
              return;
            }

            console.error(
              "Failed to load budget:",
              budgetError,
            );

            setBudgetData(null);
            setBudgetReady(false);
            setBudgetLoading(false);
          },
        );

        const [tripData, hotelsData, selectedHotel] =
          await Promise.all([
            measureRequest(
              "Trip",
              dedupeRequest(
                `trip:${tripId}`,
                () => getTrip(tripId),
              ),
            ),

            measureRequest(
              "Hotel search",
              cachedHotelSearch(
                tripId,
                () => getTripHotels(tripId),
              ),
            ),

            measureRequest(
              "Selected hotel",
              dedupeRequest(
                `selected-hotel:${tripId}`,
                () => getSelectedTripHotel(tripId),
              ),
            ),
          ]);

        if (cancelled) return;

        const selectedOfferId =
          selectedHotel?.provider_offer_id ?? null;

        const options = hotelsData.offers.map((offer) => {
          const option = mapHotelOfferToOption(
            offer,
            hotelsData.recommended_hotel_id,
            selectedOfferId,
          );

          if (selectedHotel && offer.id === selectedOfferId) {
            return {
              ...option,
              current: true,
              totalPrice: Number(selectedHotel.converted_price),
            };
          }

          return option;
        });

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

          // These are placeholders, never shown as final budget figures.
          totalBudget: 0,
          estimatedCost: 0,
          remainingBudget: 0,

          hotelOptions: options,
        };

        setHotelOffers(hotelsData);
        setTrip(workspaceTrip);

        // Hotel comparison is ready independently of budget.
        setLoading(false);

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
      ++budgetVersion.current;
    };
  }, [tripId]);

  const refreshHotelSelection = async (): Promise<void> => {
    if (!hotelOffers) {
      throw new Error("Hotel search results are unavailable.");
    }

    // Invalidate any older in-flight budget response.
    const currentBudgetVersion = ++budgetVersion.current;

    setBudgetLoading(true);
    setBudgetReady(false);

    try {
      // Fetch fresh data after a successful save/remove.
      const [selectedHotel, updatedBudget] = await Promise.all([
        getSelectedTripHotel(tripId),
        getTripBudget(tripId),
      ]);

      if (currentBudgetVersion !== budgetVersion.current) {
        return;
      }

      const selectedOfferId =
        selectedHotel?.provider_offer_id ?? null;

      // Rebuild from original search results so old
      // selections and inserted offers don't remain stale.
      const options = hotelOffers.offers.map((offer) => {
        const option = mapHotelOfferToOption(
          offer,
          hotelOffers.recommended_hotel_id,
          selectedOfferId,
        );

        if (
          selectedHotel &&
          offer.id === selectedOfferId
        ) {
          return {
            ...option,
            current: true,
            totalPrice: Number(selectedHotel.converted_price),
          };
        }

        return option;
      });

      // Preserve a saved hotel that is no longer
      // included in the current search results.
      if (
        selectedHotel &&
        !options.some((option) => option.current)
      ) {
        options.unshift(
          mapSelectedHotelToOption(selectedHotel),
        );
      }

      setTrip((current) =>
        current
          ? {
              ...current,
              hotelOptions: options,
            }
          : current,
      );

      setBudgetData(updatedBudget);
      setBudgetReady(true);
    } catch (error) {
      if (currentBudgetVersion !== budgetVersion.current) {
        return;
      }

      console.error(
        "Failed to refresh selected hotel and budget:",
        error,
      );

      setBudgetData(null);
      setBudgetReady(false);

      throw error;
    } finally {
      if (currentBudgetVersion === budgetVersion.current) {
        setBudgetLoading(false);
      }
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="pt-2.5 sm:pt-3">
          {loading ? (
            <HotelComparisonSkeleton />
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
              trip={{
                ...trip,
                totalBudget: Number(budgetData?.total_budget ?? 0),
                estimatedCost: Number(budgetData?.estimated_cost ?? 0),
                remainingBudget: Number(budgetData?.remaining_budget ?? 0),
              }}
              budgetReady={budgetReady}
              budgetLoading={budgetLoading}
              onSelectionChanged={refreshHotelSelection}
              onBackAction={() => router.push(`/trips/${tripId}`)}
            />
          ) : null}
        </div>
      </div>
    </AppLayout>
  );
}


async function measureRequest<T>(
  label: string,
  request: Promise<T>,
): Promise<T> {
  const start = performance.now();

  try {
    return await request;
  } finally {
    console.log(
      `[Hotels] ${label}: ${Math.round(performance.now() - start)}ms`,
    );
  }
}