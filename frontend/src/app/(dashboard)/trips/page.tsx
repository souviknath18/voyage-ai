"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AppLayout from "@/components/layout/AppLayout";
import { PageLoader } from "@/components/ui";
import MyTripsHeader from "@/components/trips/MyTripsHeader";
import TripTabs from "@/components/trips/TripTabs";
import TripsGrid from "@/components/trips/TripsGrid";
import {
  getDestinationImage,
} from "@/lib/destination-images";

import {
  getTrips,
  type Trip,
} from "@/lib/trips";

import type {
  TripListItem,
  TripTab,
} from "@/types/trips";


/**
 * Convert the Trip returned by FastAPI
 * into the format expected by the existing
 * TripsGrid / TripCard components.
 */
function mapTripToListItem(
  trip: Trip,
): TripListItem {
  const startDate =
    new Date(trip.start_date);

  const endDate =
    new Date(trip.end_date);

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const duration =
    Math.ceil(
      (
        endDate.getTime() -
        startDate.getTime()
      ) / millisecondsPerDay,
    ) + 1;

  return {
    id: trip.trip_id,

    title:
      `${trip.destination} Trip`,

    origin:
      trip.origin,

    destination:
      trip.destination,

    startDate:
      startDate.toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      ),

    endDate:
      endDate.toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      ),

    duration,

    travelers:
      trip.travelers,

    currency:
      trip.currency,

    estimatedCost:
      trip.budget
        ? Number(trip.budget)
        : undefined,

    // Temporary image.
    // Later we can generate/select images
    // based on destination.
    // image:
    //   "/images/trips/tokyo.jpg",
    image:
      getDestinationImage(
        trip.destination,
      ),

    status:
      trip.status as TripListItem["status"],
  };
}


export default function MyTripsPage() {
  const [
    activeTab,
    setActiveTab,
  ] = useState<TripTab>("draft");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    trips,
    setTrips,
  ] = useState<TripListItem[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);


  /**
   * Fetch real trips from FastAPI.
   */
  useEffect(() => {
    const loadTrips =
      async () => {
        try {
          setLoading(true);
          setError(null);

          const data =
            await getTrips();

          const mappedTrips =
            data.map(
              mapTripToListItem,
            );

          setTrips(
            mappedTrips,
          );
        } catch (error) {
          console.error(
            "Failed to load trips:",
            error,
          );

          setError(
            error instanceof Error
              ? error.message
              : "Failed to load trips",
          );
        } finally {
          setLoading(false);
        }
      };

    loadTrips();
  }, []);


  /**
   * Calculate tab counts using
   * the real backend trips.
   */
  const counts =
    useMemo(() => {
      return {
        upcoming:
          trips.filter(
            (trip) =>
              trip.status ===
              "upcoming",
          ).length,

        draft:
          trips.filter(
            (trip) =>
              trip.status ===
              "draft",
          ).length,

        completed:
          trips.filter(
            (trip) =>
              trip.status ===
              "completed",
          ).length,

        saved:
          trips.filter(
            (trip) =>
              trip.status ===
              "saved",
          ).length,
      };
    }, [trips]);


  /**
   * Filter trips based on selected
   * tab and search query.
   */
  const filteredTrips =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return trips.filter(
        (trip) => {
          const matchesTab =
            trip.status ===
            activeTab;

          if (!matchesTab) {
            return false;
          }

          if (!query) {
            return true;
          }

          return (
            trip.title
              .toLowerCase()
              .includes(query) ||

            trip.origin
              .toLowerCase()
              .includes(query) ||

            trip.destination
              .toLowerCase()
              .includes(query)
          );
        },
      );
    }, [
      trips,
      activeTab,
      search,
    ]);


  /**
   * Loading state.
   */
  if (loading) {
    return (
      <AppLayout>
        <PageLoader
          title="Loading your trips"
          description="VoyageAI is retrieving your journeys."
        />
      </AppLayout>
    );
  }


  /**
   * API error state.
   */
  if (error) {
    return (
      <AppLayout>
        <div className="mx-auto w-full max-w-[1280px] px-4 py-10 md:px-6">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
            <h2 className="text-lg font-semibold">
              Unable to load trips
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {error}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }


  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="space-y-6">

          {/* Header */}

          <MyTripsHeader
            search={search}
            onSearchChangeAction={
              setSearch
            }
          />


          {/* Tabs */}

          <TripTabs
            activeTab={
              activeTab
            }
            counts={
              counts
            }
            onChangeAction={
              setActiveTab
            }
          />


          {/* Trips */}

          <TripsGrid
            trips={
              filteredTrips
            }
            activeTab={
              activeTab
            }
          />

        </div>
      </div>
    </AppLayout>
  );
}