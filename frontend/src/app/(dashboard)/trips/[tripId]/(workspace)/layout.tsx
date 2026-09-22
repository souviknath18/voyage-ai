"use client";

import {
  useEffect,
  useState,
} from "react";
import { useParams } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import { PageLoader } from "@/components/ui";

import TripWorkspaceHeader from "@/components/trip-workspace/TripWorkspaceHeader";
import TripWorkspaceTabs from "@/components/trip-workspace/TripWorkspaceTabs";
import TripAssistantLauncher from "@/components/trip-workspace/assistant/TripAssistantLauncher";

import {
  getDestinationImageFromApi,
} from "@/lib/api";

import {
  getTrip,
  getTripItinerary,
  type Trip,
  type TripItinerary,
} from "@/lib/trips";

import {
  mapTripToWorkspaceHeader,
} from "@/lib/trip-workspace-mappers";

interface TripWorkspaceLayoutProps {
  children: React.ReactNode;
}

export default function TripWorkspaceLayout({
  children,
}: TripWorkspaceLayoutProps) {
  const params = useParams<{
    tripId: string;
  }>();

  const tripId = params.tripId;

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

  const [
    destinationImage,
    setDestinationImage,
  ] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!tripId) {
      return;
    }

    let cancelled = false;

    const loadTrip = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          tripData,
          itineraryData,
        ] = await Promise.all([
          getTrip(tripId),
          getTripItinerary(tripId),
        ]);

        if (cancelled) {
          return;
        }

        setTrip(tripData);
        setItinerary(itineraryData);

        // Essential workspace data is ready.
        setLoading(false);

        // Destination imagery is optional.
        try {
          const image =
            await getDestinationImageFromApi(
              tripData.destination_name ||
                tripData.destination,
              tripData.destination_country,
            );

          if (cancelled) {
            return;
          }

          setDestinationImage(
            image?.url,
          );
        } catch (imageError) {
          console.warn(
            "Destination image unavailable:",
            imageError,
          );

          if (!cancelled) {
            setDestinationImage(
              undefined,
            );
          }
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load trip:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load trip",
        );

        setLoading(false);
      }
    };

    loadTrip();

    return () => {
      cancelled = true;
    };
  }, [tripId]);

  if (loading) {
    return (
      <AppLayout>
        <PageLoader
          title="Loading your trip"
          description="VoyageAI is retrieving your journey."
        />
      </AppLayout>
    );
  }

  if (error || !trip) {
    return (
      <AppLayout>
        <div className="mx-auto w-full max-w-[1280px] px-4 py-10 md:px-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
            <h2 className="text-lg font-semibold">
              Unable to load trip
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {error ?? "Trip not found"}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const headerTrip =
    mapTripToWorkspaceHeader(
      trip,
      itinerary,
      destinationImage,
    );

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="space-y-5 pt-2.5 sm:pt-3">
          <TripWorkspaceHeader
            trip={headerTrip}
          />

          <TripWorkspaceTabs
            tripId={tripId}
          />

          {children}

          <TripAssistantLauncher
            tripId={tripId}
            destination={
              trip.destination
            }
          />
        </div>
      </div>
    </AppLayout>
  );
}