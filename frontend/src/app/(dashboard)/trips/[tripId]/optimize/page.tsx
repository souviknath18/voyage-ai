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

import OptimizeTrip from "@/components/trip-workspace/optimize/OptimizeTrip";

import {
  PageLoader,
} from "@/components/ui";

import {
  getTrip,
  getTripItinerary,
  optimizeTrip,
} from "@/lib/trips";

import {
  mapTripToWorkspaceHeader,
} from "@/lib/trip-workspace-mappers";

import type {
  Trip,
  TripItinerary,
  TripOptimizationType,
} from "@/lib/trips";

import type {
  TripWorkspaceHeaderData,
  OptimizationPreset,
} from "@/types/trip-workspace";


export default function OptimizeTripPage() {
  const params =
    useParams<{
      tripId: string;
    }>();

  const router =
    useRouter();

  const [
    trip,
    setTrip,
  ] =
    useState<TripWorkspaceHeaderData | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    optimizing,
    setOptimizing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
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
        ] = await Promise.all([
          getTrip(params.tripId),
          getTripItinerary(
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
         * OptimizeTrip currently expects
         * TripWorkspaceData even though the
         * hero only uses the header fields.
         *
         * We'll clean this type later.
         */
        setTrip(
          header as TripWorkspaceHeaderData,
        );
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


  const handleStartOptimization =
    async (
      presets: OptimizationPreset[],
      customRequest: string,
    ) => {
      if (optimizing) {
        return;
      }

      try {
        setOptimizing(true);
        setError(null);

        let optimizationType:
          TripOptimizationType;

        let instructions:
          string | null = null;

        if (presets.length > 0) {
          optimizationType =
            presets[0];

          instructions =
            customRequest || null;
        } else {
          optimizationType =
            "custom";

          instructions =
            customRequest;
        }

        const run =
          await optimizeTrip(
            params.tripId,
            {
              optimization_type:
                optimizationType,

              instructions,
            },
          );

        router.push(
          `/planning/${run.id}`,
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to start optimization",
        );

        setOptimizing(false);
      }
    };


  if (loading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }


  if (error && !trip) {
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
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="pt-2.5 sm:pt-3">

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <OptimizeTrip
            trip={trip}
            onCloseAction={() =>
              router.push(
                `/trips/${params.tripId}`,
              )
            }
            onStartOptimizationAction={
              handleStartOptimization
            }
          />

          {optimizing && (
            <p className="mt-3 text-center text-xs text-[#948e9c]">
              Starting optimization...
            </p>
          )}

        </div>
      </div>
    </AppLayout>
  );
}