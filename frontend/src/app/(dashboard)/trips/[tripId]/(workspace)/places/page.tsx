"use client";

import {
  useEffect,
  useState,
} from "react";

import { useParams } from "next/navigation";

import TripPlaces from "@/components/trip-workspace/places/TripPlaces";

import {
  getTrip,
  getTripItinerary,
  getTripPlaces,
} from "@/lib/trips";

import {
  mapTripPlaces,
} from "@/lib/place-mappers";

import type {
  TripPlace,
} from "@/types/trip-workspace";


export default function PlacesPage() {
  const params = useParams();

  const tripId =
    params.tripId as string;

  const [
    places,
    setPlaces,
  ] = useState<TripPlace[]>([]);

  const [
    currency,
    setCurrency,
  ] = useState("INR");

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
    async function loadPlaces() {
      try {
        setLoading(true);
        setError(null);

        const [
          trip,
          apiPlaces,
          itinerary,
        ] = await Promise.all([
          getTrip(tripId),
          getTripPlaces(tripId),
          getTripItinerary(tripId),
        ]);

        const mappedPlaces =
          mapTripPlaces(
            apiPlaces,
            itinerary,
          );

        setPlaces(
          mappedPlaces,
        );

        setCurrency(
          trip.currency,
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load places",
        );
      } finally {
        setLoading(false);
      }
    }

    if (tripId) {
      loadPlaces();
    }
  }, [tripId]);

  if (loading) {
    return (
      <div className="p-6 text-sm text-[#948e9c]">
        Loading places...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-red-400">
        {error}
      </div>
    );
  }

  return (
    <TripPlaces
      places={places}
      alternatives={[]}
      currency={currency}
    />
  );
}