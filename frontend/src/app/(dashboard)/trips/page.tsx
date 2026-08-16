"use client";

import {
  useMemo,
  useState,
} from "react";

import AppLayout from "@/components/layout/AppLayout";

import MyTripsHeader from "@/components/trips/MyTripsHeader";
import TripTabs from "@/components/trips/TripTabs";
import TripsGrid from "@/components/trips/TripsGrid";

import type {
  TripListItem,
  TripTab,
} from "@/types/trips";

const trips: TripListItem[] = [
  {
    id: "trip-001",

    title:
      "Neon Nights in Tokyo",

    origin:
      "Bangalore",

    destination:
      "Tokyo",

    startDate:
      "15 Dec 2026",

    endDate:
      "22 Dec 2026",

    duration: 8,

    travelers: 1,

    currency: "INR",

    estimatedCost:
      184000,

    image:
      "/images/trips/tokyo.jpg",

    status:
      "upcoming",
  },

  {
    id: "trip-002",

    title:
      "Amalfi Escape",

    origin:
      "Bangalore",

    destination:
      "Amalfi Coast",

    duration: 5,

    travelers: 2,

    currency: "INR",

    image:
      "/images/trips/amalfi.jpg",

    status:
      "draft",
  },

  {
    id: "trip-003",

    title:
      "Bali Slow Escape",

    origin:
      "Bangalore",

    destination:
      "Bali",

    startDate:
      "04 Oct 2026",

    endDate:
      "10 Oct 2026",

    duration: 7,

    travelers: 2,

    currency: "INR",

    estimatedCost:
      110000,

    image:
      "/images/trips/bali.jpg",

    status:
      "upcoming",
  },

  {
    id: "trip-004",

    title:
      "Dubai Weekend",

    origin:
      "Bangalore",

    destination:
      "Dubai",

    startDate:
      "12 Mar 2026",

    endDate:
      "16 Mar 2026",

    duration: 5,

    travelers: 1,

    currency: "INR",

    estimatedCost:
      78000,

    image:
      "/images/trips/dubai.jpg",

    status:
      "completed",
  },

  {
    id: "trip-005",

    title:
      "Swiss Alpine Journey",

    origin:
      "Bangalore",

    destination:
      "Switzerland",

    duration: 9,

    travelers: 2,

    currency: "INR",

    estimatedCost:
      265000,

    image:
      "/images/trips/switzerland.jpg",

    status:
      "saved",
  },
];

export default function MyTripsPage() {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<TripTab>(
      "upcoming",
    );

  const [
    search,
    setSearch,
  ] = useState("");

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
    }, []);

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
              .includes(
                query,
              ) ||
            trip.origin
              .toLowerCase()
              .includes(
                query,
              ) ||
            trip.destination
              .toLowerCase()
              .includes(
                query,
              )
          );
        },
      );
    }, [
      activeTab,
      search,
    ]);

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
            counts={counts}
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