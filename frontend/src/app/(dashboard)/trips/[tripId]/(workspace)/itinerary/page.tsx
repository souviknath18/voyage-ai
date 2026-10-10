"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import TripItinerary from "@/components/trip-workspace/itinerary/TripItinerary";
import ItineraryVersionHistory from "@/components/trip-workspace/itinerary/ItineraryVersionHistory";

import TripItinerarySkeleton from "@/components/trip-workspace/itinerary/TripItinerarySkeleton";

import {
  getTrip,
  getTripItinerary,
  getTripItineraryVersion,
  getTripItineraryVersions,
  getTripWeather,
  restoreTripItineraryVersion,
  type ItineraryVersion,
  type TripItinerary as TripItineraryResponse,
  type TripWeather,
} from "@/lib/trips";

import {
  mapItineraryToWorkspace,
} from "@/lib/itinerary-mappers";

import {
  getPlaceImagesBatch,
} from "@/lib/api";

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
    versions,
    setVersions,
  ] = useState<ItineraryVersion[]>([]);


  const [
    currentVersion,
    setCurrentVersion,
  ] = useState<number | null>(null);


  const [
    restoringVersion,
    setRestoringVersion,
  ] = useState<number | null>(null);


  const [
    historyError,
    setHistoryError,
  ] = useState<string | null>(null);


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

    let cancelled = false;

    const loadItinerary = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          itineraryData,
          tripData,
          versionData,
        ] = await Promise.all([
          getTripItinerary(
            tripId,
          ),

          getTrip(
            tripId,
          ),

          getTripItineraryVersions(
            tripId,
          ),
        ]);

        if (cancelled) {
          return;
        }

        setItineraryResponse(
          itineraryData,
        );

        setVersions(
          versionData,
        );

        setCurrentVersion(
          itineraryData.version,
        );

        // Essential itinerary renders immediately.
        setItinerary(
          mapItineraryToWorkspace(
            itineraryData,
            null,
          ),
        );

        setLoading(false);

        const activityImages: Record<
          string,
          string
        > = {};

        let weatherData: TripWeather | null = null;

        // Optional weather.
        const weatherPromise =
          getTripWeather(
            tripId,
          )
            .then((weather) => {
              weatherData = weather;

              if (cancelled) {
                return;
              }

              setItinerary(
                mapItineraryToWorkspace(
                  itineraryData,
                  weather,
                  activityImages,
                ),
              );
            })
            .catch((weatherError) => {
              console.warn(
                "Weather unavailable:",
                weatherError,
              );
            });

        const placeRequests =
          itineraryData.days.flatMap(
            (day) =>
              day.activities.map(
                (activity) => ({
                  key: activity.id,
                  place_name:
                    activity.title,
                  destination:
                    tripData.destination_name ||
                    tripData.destination,
                  country:
                    tripData.destination_country,
                }),
              ),
          );

        const imagesPromise =
          placeRequests.length > 0
            ? getPlaceImagesBatch(
                placeRequests,
              )
                .then((response) => {
                  if (cancelled) {
                    return;
                  }

                  for (
                    const item
                    of response.images
                  ) {
                    if (item.image) {
                      activityImages[
                        item.key
                      ] =
                        item.image
                          .thumbnail_url;
                    }
                  }

                  setItinerary(
                    mapItineraryToWorkspace(
                      itineraryData,
                      weatherData,
                      activityImages,
                    ),
                  );
                })
                .catch((imageError) => {
                  console.warn(
                    "Activity images unavailable:",
                    imageError,
                  );
                })
            : Promise.resolve();

        await Promise.allSettled([
          weatherPromise,
          imagesPromise,
        ]);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load itinerary:",
          error,
        );

        setLoading(false);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load itinerary",
        );
      }
    };

    loadItinerary();

    return () => {
      cancelled = true;
    };
  }, [tripId]);


  const handleViewVersion =
    async (
      version: number,
    ) => {
      try {
        setHistoryError(
          null,
        );

        const versionData =
          await getTripItineraryVersion(
            tripId,
            version,
          );


        setItineraryResponse(
          versionData,
        );


        setItinerary(
          mapItineraryToWorkspace(
            versionData,
            null,
          ),
        );
      } catch (error) {
        setHistoryError(
          error instanceof Error
            ? error.message
            : "Failed to load itinerary version",
        );
      }
    };


  const handleRestoreVersion =
    async (
      version: number,
    ) => {
      if (
        restoringVersion !== null
      ) {
        return;
      }


      try {
        setRestoringVersion(
          version,
        );

        setHistoryError(
          null,
        );


        const restored =
          await restoreTripItineraryVersion(
            tripId,
            version,
          );


        const refreshedVersions =
          await getTripItineraryVersions(
            tripId,
          );


        setVersions(
          refreshedVersions,
        );


        setCurrentVersion(
          restored.version,
        );


        setItineraryResponse(
          restored,
        );


        setItinerary(
          mapItineraryToWorkspace(
            restored,
            null,
          ),
        );
      } catch (error) {
        setHistoryError(
          error instanceof Error
            ? error.message
            : "Failed to restore itinerary version",
        );
      } finally {
        setRestoringVersion(
          null,
        );
      }
    };


  if (loading) {
    return <TripItinerarySkeleton />;
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
    <div className="space-y-5">

      {historyError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {historyError}
        </div>
      )}


      <TripItinerary
        tripId={tripId}
        itinerary={itinerary}
        currency={
          itineraryResponse.currency
        }
        version={
          itineraryResponse.version
        }
        currentVersion={
          currentVersion ??
          itineraryResponse.version
        }
        versions={versions}
        restoringVersion={
          restoringVersion
        }
        onViewVersionAction={
          handleViewVersion
        }
        onRestoreVersionAction={
          handleRestoreVersion
        }
      />

    </div>
  );
}