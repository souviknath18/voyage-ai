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

import {
  getPlaceImagesBatch,
} from "@/lib/api";


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
    if (!tripId) {
      return;
    }

    let cancelled = false;

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

        if (cancelled) {
          return;
        }

        const mappedPlaces =
          mapTripPlaces(
            apiPlaces,
            itinerary,
          );

        // Render real place data immediately.
        setPlaces(
          mappedPlaces,
        );

        setCurrency(
          trip.currency,
        );

        setLoading(false);

        // Images are optional and load afterward.
        if (apiPlaces.length === 0) {
          return;
        }

        try {
          const requests =
            apiPlaces.map(
              (place) => ({
                key: place.id,

                place_name:
                  place.name,

                destination:
                  trip.destination_name ||
                  trip.destination,

                country:
                  trip.destination_country,
              }),
            );

          const placeImages: Record<
            string,
            string
          > = {};

          const batchSize = 30;

          for (
            let index = 0;
            index < requests.length;
            index += batchSize
          ) {
            if (cancelled) {
              return;
            }

            const batch =
              requests.slice(
                index,
                index + batchSize,
              );

            const response =
              await getPlaceImagesBatch(
                batch,
              );

            for (
              const item
              of response.images
            ) {
              if (item.image) {
                placeImages[item.key] =
                  item.image.url;
              }
            }

            if (cancelled) {
              return;
            }

            // Update progressively after each batch.
            setPlaces(
              mapTripPlaces(
                apiPlaces,
                itinerary,
                placeImages,
              ),
            );
          }
        } catch (imageError) {
          console.warn(
            "Place images unavailable:",
            imageError,
          );
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load places",
        );

        setLoading(false);
      }
    }

    loadPlaces();

    return () => {
      cancelled = true;
    };
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