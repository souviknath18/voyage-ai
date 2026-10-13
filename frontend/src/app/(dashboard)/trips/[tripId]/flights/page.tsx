"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import FlightComparison from "@/components/trip-workspace/flights/FlightComparison";
import { dedupeRequest } from "@/lib/request-dedup";
import FlightPageSkeleton from "@/components/trip-workspace/flights/FlightPageSkeleton";

import {
  getSelectedTripFlight,
  getTripBudget,
  getTripFlights,
} from "@/lib/trips";

import {
  mapSelectedFlightToComparisonOption,
  shortlistFlights,
} from "@/lib/flight-mappers";

import type {
  FlightComparisonOption,
  FlightComparisonTripData,
} from "@/types/trip-workspace";

function formatTripDate(
  date: string,
): string {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    },
  ).format(
    new Date(
      `${date}T00:00:00Z`,
    ),
  );
}

export default function FlightComparisonPage() {
  const router =
    useRouter();

  const params =
    useParams<{
      tripId: string;
    }>();

  const tripId =
    params.tripId;

  const [
    trip,
    setTrip,
  ] = useState<FlightComparisonTripData | null>(
    null,
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadFlights() {
      try {
        setLoading(true);
        setError(null);

        const [response, selectedFlight, budget] =
          await Promise.all([
            dedupeRequest(
              `trip-flights:${tripId}`,
              () => getTripFlights(tripId),
            ),
            dedupeRequest(
              `trip-selected-flight:${tripId}`,
              () => getSelectedTripFlight(tripId),
            ),
            dedupeRequest(
              `trip-budget:${tripId}`,
              () => getTripBudget(tripId),
            ),
          ]);

        if (cancelled) return;

        setTrip(
          buildFlightTrip(response, selectedFlight, budget),
        );
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load flights:", error);
        setError("Unable to load flight options.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadFlights();

    return () => {
      cancelled = true;
    };
  }, [tripId]);

  const refreshBudget = async () => {
    if (!tripId) return;

    const budget = await getTripBudget(tripId);

    setTrip((currentTrip) => {
      if (!currentTrip) return null;

      return {
        ...currentTrip,
        totalBudget:
          budget.total_budget == null
            ? null
            : Number(budget.total_budget),
        estimatedCost: Number(budget.estimated_cost),
      };
    });
  }; 

  if (loading) {
    return (
      <AppLayout>
        <FlightPageSkeleton />
      </AppLayout>
    );
  }

  if (
    error ||
    !trip
  ) {
    return (
      <AppLayout>
        <div className="mx-auto w-full max-w-[1280px] px-4 py-10 md:px-6">
          <p className="text-sm text-[#fb7185]">
            {error ??
              "Unable to load flights."}
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="pt-2.5 sm:pt-3">
          <FlightComparison
            trip={trip}
            tripId={tripId}
            onBackAction={() =>
              router.push(`/trips/${tripId}`)
            }
            onBudgetRefreshAction={refreshBudget}
          />
        </div>
      </div>
    </AppLayout>
  );
}


function buildFlightTrip(
  response: Awaited<ReturnType<typeof getTripFlights>>,
  selectedFlight: Awaited<ReturnType<typeof getSelectedTripFlight>>,
  budget: Awaited<ReturnType<typeof getTripBudget>>,
): FlightComparisonTripData {
  const freshFlightOptions = shortlistFlights(
    response.offers,
    6,
  );

  let flightOptions: FlightComparisonOption[] =
    freshFlightOptions.map((flight) => ({
      ...flight,
      current:
        selectedFlight !== null &&
        flight.id === selectedFlight.provider_offer_id,
    }));

  if (selectedFlight) {
    const selectedOfferExists = flightOptions.some(
      (flight) =>
        flight.id === selectedFlight.provider_offer_id,
    );

    if (!selectedOfferExists) {
      flightOptions = [
        mapSelectedFlightToComparisonOption(selectedFlight),
        ...flightOptions,
      ];
    }
  }

  return {
    id: response.trip_id,
    origin: response.origin,
    destination: response.destination,
    originCode: response.origin_code,
    destinationCode: response.destination_code,
    travelers: response.travelers,
    startDate: formatTripDate(response.start_date),
    endDate: formatTripDate(response.end_date),
    currency: budget.currency,
    totalBudget:
      budget.total_budget === null ||
      budget.total_budget === undefined
        ? null
        : Number(budget.total_budget),
    estimatedCost: Number(budget.estimated_cost),
    flightOptions,
  };
}