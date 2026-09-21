"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import TripItinerary from "@/components/trip-workspace/itinerary/TripItinerary";

import {
  PageLoader,
} from "@/components/ui";

import {
  getTripItinerary,
  getTripWeather,
  type TripItinerary as TripItineraryResponse,
} from "@/lib/trips";

import {
  mapItineraryToWorkspace,
} from "@/lib/itinerary-mappers";

import type {
  ItineraryDayData,
} from "@/types/trip-workspace";


export default function TripItineraryPage() {
  const params =
    useParams<{
      tripId: string;
    }>();

  const tripId =
    params.tripId;


  const [
    itinerary,
    setItinerary,
  ] =
    useState<
      ItineraryDayData[]
    >([]);


  const [
    itineraryResponse,
    setItineraryResponse,
  ] =
    useState<
      TripItineraryResponse | null
    >(null);


  const [
    loading,
    setLoading,
  ] =
    useState(
      true,
    );


  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);


  useEffect(() => {
    if (!tripId) {
      return;
    }


    const loadItinerary =
      async () => {
        try {
          setLoading(
            true,
          );

          setError(
            null,
          );


          const [
            itineraryData,
            weatherData,
          ] =
            await Promise.all([
              getTripItinerary(
                tripId,
              ),

              getTripWeather(
                tripId,
              ),
            ]);


          setItineraryResponse(
            itineraryData,
          );


          setItinerary(
            mapItineraryToWorkspace(
              itineraryData,
              weatherData,
            ),
          );
        } catch (error) {
          console.error(
            "Failed to load itinerary:",
            error,
          );


          setError(
            error instanceof Error
              ? error.message
              : "Failed to load itinerary",
          );
        } finally {
          setLoading(
            false,
          );
        }
      };


    loadItinerary();
  }, [
    tripId,
  ]);


  if (loading) {
    return (
      <PageLoader
        title="Loading your itinerary"
        description="VoyageAI is retrieving your AI-planned journey."
      />
    );
  }


  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">

        <h2 className="text-lg font-semibold">
          Unable to load itinerary
        </h2>


        <p className="mt-2 text-sm text-muted-foreground">
          {error}
        </p>

      </div>
    );
  }


  if (!itineraryResponse) {
    return (
      <div className="rounded-xl border p-6">

        <h2 className="text-lg font-semibold">
          No itinerary available
        </h2>


        <p className="mt-2 text-sm text-muted-foreground">
          Generate an itinerary for this
          trip first.
        </p>

      </div>
    );
  }


  return (
    <TripItinerary
      tripId={
        tripId
      }
      itinerary={
        itinerary
      }
      currency={
        itineraryResponse.currency
      }
    />
  );
}