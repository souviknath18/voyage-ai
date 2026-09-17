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
  getTripItinerary,
  type Trip,
  type TripItinerary,
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

  const [
    itinerary,
    setItinerary,
  ] = useState<TripItinerary | null>(
    null,
  );

  useEffect(() => {
    const loadTrip =
      async () => {
        try {
          setLoading(true);
          setError(null);

          const [
            tripData,
            itineraryData,
          ] = await Promise.all([
            getTrip(params.tripId),
            getTripItinerary(params.tripId),
          ]);

          setTrip(tripData);
          setItinerary(itineraryData);
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

  const estimatedCost =
    itinerary?.days.reduce(
      (tripTotal, day) =>
        tripTotal +
        day.activities.reduce(
          (dayTotal, activity) =>
            dayTotal +
            Number(
              activity.estimated_cost,
            ),
          0,
        ),
      0,
    ) ?? 0;

  const budgetBreakdown =
    itinerary?.days.map(
      (day) => ({
        label: `Day ${day.day_number}`,
        amount:
          day.activities.reduce(
            (
              total,
              activity,
            ) =>
              total +
              Number(
                activity.estimated_cost,
              ),
            0,
          ),
      }),
    ) ?? [];


  return (
    <div className="space-y-5">

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">

        <div className="lg:col-span-8">
          <TripAIOverview
            summary={
              itinerary?.summary ??
              "No AI trip summary available."
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
          currency={trip.currency}
          totalBudget={
            trip.budget
              ? Number(trip.budget)
              : 0
          }
          estimatedCost={
            estimatedCost
          }
          items={
            budgetBreakdown
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