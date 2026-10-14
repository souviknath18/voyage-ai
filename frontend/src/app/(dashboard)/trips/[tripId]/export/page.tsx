
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import ExportTrip from "@/components/trip-workspace/export/ExportTrip";
import ExportPageSkeleton from "@/components/trip-workspace/export/ExportPageSkeleton";

import {
  getTrip,
  getTripBudget,
  getTripItinerary,
  getSelectedTripFlight,
  getSelectedTripHotel,
} from "@/lib/trips";

import { getDestinationImageFromApi } from "@/lib/api";

import {
  mapSelectedFlightToTripFlights,
} from "@/lib/flight-mappers";

import {
  mapSelectedHotelToOption,
} from "@/lib/hotel-mappers";

import { mapItineraryToWorkspace } from "@/lib/itinerary-mappers";
import type { Trip } from "@/lib/trips";
import type { TripWorkspaceData } from "@/types/trip-workspace";

import { mockTrip } from "@/data/mock-trip";

function mapTripToExportData(
  trip: Trip,
): TripWorkspaceData {
  const duration = Math.max(
    1,
    Math.round(
      (Date.parse(trip.end_date) -
        Date.parse(trip.start_date)) /
        86400000,
    ),
  );

  const status: TripWorkspaceData["status"] =
    trip.lifecycle === "upcoming"
      ? "ready"
      : trip.lifecycle === "draft"
        ? "planning"
        : trip.lifecycle;

  return {
    ...mockTrip,

    id: trip.trip_id,
    title: `Trip to ${trip.destination}`,
    image: undefined,

    origin: trip.origin,
    destination: trip.destination,

    startDate: trip.start_date,
    endDate: trip.end_date,
    duration,

    travelers: trip.travelers,
    currency: trip.currency,
    status,

    // Initial values from the Trip API.
    // The Budget API will provide the latest figures.
    totalBudget: Number(trip.budget ?? 0),
    estimatedCost: Number(
      trip.estimated_total_cost ?? 0,
    ),
    remainingBudget: 0,

    budgetBreakdown: [],
    budgetCategories: [],
    budgetInsight: "",
    budgetRecommendations: [],
    potentialSavings: 0,
    flights: [],
    itinerary: [],
    hotelOptions: [],
  };
}

export default function ExportTripPage() {
  const router = useRouter();
  const { tripId } = useParams<{ tripId: string }>();

  const [trip, setTrip] =
    useState<TripWorkspaceData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTrip() {
      setLoading(true);
      setError(null);
      setTrip(null);

      try {
        const result = await getTrip(tripId);

        const exportTrip = mapTripToExportData(result);

        try {
          const destinationImage =
            await getDestinationImageFromApi(
              result.destination_name || result.destination,
              result.destination_country,
            );

          exportTrip.image = destinationImage?.url;
        } catch (imageError) {
          console.warn(
            "Destination cover image unavailable:",
            imageError,
          );

          exportTrip.image = undefined;
        }

        try {
          const itinerary = await getTripItinerary(tripId);

          exportTrip.itinerary =
            mapItineraryToWorkspace(itinerary);
        } catch (itineraryError) {
          console.error(
            "Unable to load itinerary for export:",
            itineraryError,
          );

          exportTrip.itinerary = [];
        }

        try {
          const selectedFlight =
            await getSelectedTripFlight(tripId);

          exportTrip.flights = selectedFlight
            ? mapSelectedFlightToTripFlights(selectedFlight)
            : [];
        } catch (flightError) {
          console.error(
            "Unable to load selected flight for export:",
            flightError,
          );

          exportTrip.flights = [];
        }
        
        try {
          const selectedHotel =
            await getSelectedTripHotel(tripId);

          exportTrip.hotelOptions = selectedHotel
            ? [mapSelectedHotelToOption(selectedHotel)]
            : [];
        } catch (hotelError) {
          console.error(
            "Unable to load selected hotel for export:",
            hotelError,
          );

          exportTrip.hotelOptions = [];
        }

        try {
          const budget = await getTripBudget(tripId);

          exportTrip.currency = budget.currency;

          exportTrip.totalBudget = Number(
            budget.total_budget ?? 0,
          );

          exportTrip.estimatedCost = Number(
            budget.estimated_cost,
          );

          exportTrip.remainingBudget = Number(
            budget.remaining_budget ?? 0,
          );

          const categoryLabels: Record<
            string,
            string
          > = {
            flight: "Flights",
            accommodation: "Accommodation",
            food: "Food",
            transport: "Transport",
            activity: "Activities",
            shopping: "Shopping",
            other: "Other",
          };

          exportTrip.budgetBreakdown =
            budget.categories.map((category) => ({
              label:
                categoryLabels[category.category] ??
                category.category,
              amount: Number(category.estimated_cost),
            }));

          exportTrip.budgetCategories =
            budget.categories.map((category) => ({
              id: category.category,
              label:
                categoryLabels[category.category] ??
                category.category,
              amount: Number(category.estimated_cost),
              source: "estimated" as const,
              type:
                category.category === "accommodation"
                  ? ("hotel" as const)
                  : category.category === "activity"
                    ? ("activities" as const)
                    : category.category === "other"
                      ? ("buffer" as const)
                      : category.category,
            }));

          exportTrip.budgetInsight =
            budget.insight.description;

          exportTrip.budgetRecommendations =
            budget.recommendations.map(
              (recommendation, index) => ({
                id: `budget-recommendation-${index}`,
                title: recommendation.title,
                description: recommendation.description,
                savings: Number(
                  recommendation.estimated_savings,
                ),
                type:
                  recommendation.category === "accommodation"
                    ? ("hotel" as const)
                    : recommendation.category === "shopping" ||
                        recommendation.category === "other"
                      ? ("activity" as const)
                      : recommendation.category,
              }),
            );

          exportTrip.potentialSavings = Number(
            budget.potential_savings.amount,
          );
        } catch (budgetError) {
          console.error(
            "Unable to load budget for export:",
            budgetError,
          );
        }

        if (!cancelled) {
          setTrip(exportTrip);
        }
      } catch (err) {
        console.error("Failed to load export trip:", err);

        if (!cancelled) {
          setError(
            "Unable to load trip details. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (tripId) {
      void loadTrip();
    }

    return () => {
      cancelled = true;
    };
  }, [tripId]);

  return (
    <AppLayout>
      <div className="w-full px-4 pb-4 pt-3 md:px-6">
        {loading ? (
          <ExportPageSkeleton />
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-sm text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-[#e6e0e8] underline"
            >
              Try again
            </button>
          </div>
        ) : trip ? (
          <ExportTrip
            trip={trip}
            onBackAction={() => router.back()}
          />
        ) : null}
      </div>
    </AppLayout>
  );
}