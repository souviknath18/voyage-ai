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

import {
  mockTrip,
} from "@/data/mock-trip";

import {
  getSelectedTripFlight,
  getTripFlights,
} from "@/lib/trips";

import {
  shortlistFlights,
} from "@/lib/flight-mappers";

import type {
  TripWorkspaceData,
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
  ] = useState<TripWorkspaceData | null>(
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
    async function loadFlights() {
      try {
        setLoading(true);
        setError(null);

        const [
          response,
          selectedFlight,
        ] = await Promise.all([
          getTripFlights(
            tripId,
          ),
          getSelectedTripFlight(
            tripId,
          ),
        ]);

        const flightOptions =
          shortlistFlights(
            response.offers,
            6,
          ).map(
            (flight) => ({
              ...flight,

              current:
                selectedFlight !== null &&
                flight.id ===
                  selectedFlight.provider_offer_id,
            }),
          );

        setTrip({
          ...mockTrip,

          id: response.trip_id,

          origin:
            response.origin,

          destination:
            response.destination,

          originCode:
            response.origin_code,

          destinationCode:
            response.destination_code,

          travelers:
            response.travelers,

          startDate:
            formatTripDate(
              response.start_date,
            ),

          endDate:
            formatTripDate(
              response.end_date,
            ),

          currency:
            response.currency,

          flightOptions,
        });
      } catch (error) {
        console.error(
          "Failed to load flights:",
          error,
        );

        setError(
          "Unable to load flight options.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadFlights();
  }, [
    tripId,
  ]);

  if (loading) {
    return (
      <AppLayout>
        <div className="mx-auto w-full max-w-[1280px] px-4 py-10 text-sm text-[#948e9c] md:px-6">
          Loading flights...
        </div>
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
              router.push(
                `/trips/${tripId}`,
              )
            }
          />
        </div>
      </div>
    </AppLayout>
  );
}