"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import TripAIOverview from "@/components/trip-workspace/TripAIOverview";
import TripBudgetOverview from "@/components/trip-workspace/TripBudgetOverview";
import TripFlightCard from "@/components/trip-workspace/TripFlightCard";
import TripHighlights from "@/components/trip-workspace/TripHighlights";
import TripHotelCard from "@/components/trip-workspace/TripHotelCard";
import TripOptimizationActions from "@/components/trip-workspace/TripOptimizationActions";
import TripWarningCard from "@/components/trip-workspace/TripWarningCard";
import TripWeatherCard from "@/components/trip-workspace/TripWeatherCard";

import {
  getTrip,
  type Trip,
} from "@/lib/trips";

import {
  mockTrip,
} from "@/data/mock-trip";


export default function TripOverviewPage() {
  const router =
    useRouter();

  const params =
    useParams<{
      tripId: string;
    }>();

  const [
    trip,
    setTrip,
  ] = useState<Trip | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);


  useEffect(() => {
    const loadTrip =
      async () => {
        try {
          setLoading(true);
          setError(null);

          const data =
            await getTrip(
              params.tripId,
            );

          setTrip(data);
        } catch (error) {
          console.error(
            "Failed to load trip:",
            error,
          );

          setError(
            error instanceof Error
              ? error.message
              : "Failed to load trip",
          );
        } finally {
          setLoading(false);
        }
      };

    if (params.tripId) {
      loadTrip();
    }
  }, [params.tripId]);


  const handleResolveConflict =
    () => {
      console.log(
        "Resolve conflict",
      );
    };


  const handleOptimizationPreset = (
    type: string,
  ) => {
    console.log(
      "Optimization:",
      type,
    );

    if (!trip) {
      return;
    }

    router.push(
      `/trips/${trip.trip_id}/optimize`,
    );
  };


  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading trip...
        </p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="font-semibold">
          Unable to load trip
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {error}
        </p>
      </div>
    );
  }


  if (!trip) {
    return (
      <div className="p-6">
        Trip not found.
      </div>
    );
  }


  return (
    <div className="space-y-5">

      {/*
       * TEMPORARY:
       *
       * This section proves that the workspace
       * is loading the real Trip from FastAPI.
       *
       * Later this information should live in
       * your workspace header.
       */}
      <div className="rounded-xl border p-5">
        <div className="flex flex-col gap-2">

          <div className="flex items-center gap-2">
            <span className="rounded-full border px-3 py-1 text-xs font-medium capitalize">
              {trip.status}
            </span>
          </div>

          <h1 className="text-2xl font-semibold">
            {trip.destination} Trip
          </h1>

          <p className="text-sm text-muted-foreground">
            {trip.origin}
            {" → "}
            {trip.destination}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">

            <span>
              {trip.start_date}
              {" → "}
              {trip.end_date}
            </span>

            <span>
              {trip.travelers}{" "}
              {trip.travelers === 1
                ? "traveler"
                : "travelers"}
            </span>

            {trip.budget && (
              <span>
                {trip.currency}{" "}
                {Number(
                  trip.budget,
                ).toLocaleString(
                  "en-IN",
                )}
              </span>
            )}

          </div>
        </div>
      </div>


      {/*
       * AI-generated data below is still mocked.
       *
       * Later AgentRun / itinerary generation
       * will replace these values.
       */}


      {/* AI + Warning */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">

        <div className="lg:col-span-8">
          <TripAIOverview
            summary={
              mockTrip.aiSummary
            }
          />
        </div>

        {mockTrip.warning && (
          <div className="lg:col-span-4">
            <TripWarningCard
              title={
                mockTrip.warning.title
              }
              description={
                mockTrip.warning
                  .description
              }
              onResolveAction={
                handleResolveConflict
              }
            />
          </div>
        )}

      </div>


      {/* Travel Details */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">

        <div className="lg:col-span-5">
          <TripFlightCard
            flights={
              mockTrip.flights
            }
            onCompareAction={() =>
              router.push(
                `/trips/${trip.trip_id}/flights`,
              )
            }
          />
        </div>


        <div className="lg:col-span-5">
          <TripHotelCard
            hotel={
              mockTrip.hotel
            }
            onViewDetailsAction={() =>
              router.push(
                `/trips/${trip.trip_id}/hotels/${mockTrip.hotel.id}`,
              )
            }
            onCompareAction={() =>
              router.push(
                `/trips/${trip.trip_id}/hotels`,
              )
            }
          />
        </div>


        <div className="lg:col-span-2">
          <TripWeatherCard
            weather={
              mockTrip.weather
            }
          />
        </div>

      </div>


      {/* Budget + Highlights */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        <TripBudgetOverview
          currency={
            trip.currency
          }
          totalBudget={
            trip.budget
              ? Number(trip.budget)
              : 0
          }
          estimatedCost={
            mockTrip.estimatedCost
          }
          items={
            mockTrip.budgetBreakdown
          }
        />


        <TripHighlights
          highlights={
            mockTrip.highlights
          }
        />

      </div>


      {/* Optimization */}

      <TripOptimizationActions
        onOptimizeAction={
          handleOptimizationPreset
        }
      />

    </div>
  );
}