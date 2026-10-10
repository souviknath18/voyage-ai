"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";

import TripAssistant from "@/components/trip-workspace/assistant/TripAssistant";

import {
  PageLoader,
} from "@/components/ui";

import {
  getTrip,
  getTripItinerary,
  getTripPreferences,
} from "@/lib/trips";

import {
  mapTripToWorkspaceHeader,
} from "@/lib/trip-workspace-mappers";

import type {
  TripWorkspaceData,
} from "@/types/trip-workspace";

import {
  mockTrip,
} from "@/data/mock-trip";


export default function TripAssistantPage() {
  const router =
    useRouter();

  const searchParams = useSearchParams();

  const initialRequest =
    searchParams.get("request") ?? undefined;

  const params =
    useParams<{
      tripId: string;
    }>();

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
    let cancelled = false;

    const loadTrip = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          tripData,
          itinerary,
          preferences,
        ] = await Promise.all([
          getTrip(params.tripId),
          getTripItinerary(
            params.tripId,
          ),
          getTripPreferences(
            params.tripId,
          ),
        ]);

        if (cancelled) {
          return;
        }

        const header =
          mapTripToWorkspaceHeader(
            tripData,
            itinerary,
          );

        /*
         * Keep the existing Assistant UI data
         * for fields that are not connected yet,
         * but replace all real trip/header fields
         * with backend data.
         */
        const realTrip: TripWorkspaceData = {
          ...mockTrip,
          ...header,

          id: tripData.trip_id,

          originCode:
            tripData.origin_name ??
            header.origin,

          destinationCode:
            tripData.destination_name ??
            header.destination,

          preferences: [
            preferences.pace,
            ...preferences.interests,
          ],

          hotel: {
            ...mockTrip.hotel,
            name: "Not selected",
          },
        };

        setTrip(realTrip);
      } catch (err) {
        if (cancelled) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load trip",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTrip();

    return () => {
      cancelled = true;
    };
  }, [params.tripId]);


  if (loading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }


  if (error) {
    return (
      <AppLayout>
        <div className="mx-auto w-full max-w-[1280px] px-4 py-10 md:px-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
            {error}
          </div>
        </div>
      </AppLayout>
    );
  }


  if (!trip) {
    return null;
  }


  return (
    <AppLayout>
      <div className="h-[calc(100dvh-3.5rem)] w-full overflow-hidden px-4 py-3 md:px-6">
        <TripAssistant
          trip={trip}
          initialRequest={initialRequest}
          onBackAction={() =>
            router.push(
              `/trips/${params.tripId}`,
            )
          }
        />
      </div>
    </AppLayout>
  );
}