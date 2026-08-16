"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  TripMapDay,
  TripMapLocation,
} from "@/types/trip-workspace";

import MapDaySelector from "./MapDaySelector";
import MapItineraryPanel from "./MapItineraryPanel";
import MapRouteOptimizer from "./MapRouteOptimizer";
import TripMapCanvas from "./TripMapCanvas";

interface TripMapProps {
  days: TripMapDay[];

  currency: string;

  destination: string;
}

export default function TripMap({
  days,
  currency,
  destination,
}: TripMapProps) {
  const [
    selectedDay,
    setSelectedDay,
  ] =
    useState<
      number | "all"
    >(1);

  const [
    selectedLocationId,
    setSelectedLocationId,
  ] =
    useState<string>();

  const visibleLocations =
    useMemo(() => {
      if (
        selectedDay ===
        "all"
      ) {
        return days.flatMap(
          (day) =>
            day.locations,
        );
      }

      return (
        days.find(
          (day) =>
            day.dayNumber ===
            selectedDay,
        )?.locations ?? []
      );
    }, [
      days,
      selectedDay,
    ]);

  const selectedDayData =
    selectedDay === "all"
      ? undefined
      : days.find(
          (day) =>
            day.dayNumber ===
            selectedDay,
        );

  const handleDayChange = (
    day:
      | number
      | "all",
  ) => {
    setSelectedDay(day);

    setSelectedLocationId(
      undefined,
    );
  };

  const handleOptimize =
    () => {
      console.log(
        "Optimize route",
      );
    };

  const handleModify =
    (
      locationId: string,
    ) => {
      console.log(
        "Modify location:",
        locationId,
      );
    };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#e6e0e8] sm:text-xl">
            Trip Map
          </h2>

          <p className="mt-1 text-sm text-[#948e9c]">
            Visualize your itinerary
            and travel route across{" "}
            {destination}.
          </p>
        </div>

        <MapDaySelector
          days={days.map(
            (day) =>
              day.dayNumber,
          )}
          selectedDay={
            selectedDay
          }
          onChangeAction={
            handleDayChange
          }
        />
      </div>

      {/* Workspace */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Itinerary panel */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="h-[520px] lg:h-[650px]">
            <MapItineraryPanel
              locations={
                visibleLocations
              }
              selectedLocationId={
                selectedLocationId
              }
              title={
                selectedDay ===
                "all"
                  ? "Full Trip Route"
                  : `Day ${selectedDay} Route`
              }
              subtitle={
                selectedDayData
                  ? `${selectedDayData.date} • ${selectedDayData.title}`
                  : `${days.length} Day ${destination} Itinerary`
              }
              onSelectLocationAction={
                setSelectedLocationId
              }
            />
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-8 xl:col-span-9">
          <TripMapCanvas
            locations={
              visibleLocations
            }
            selectedLocationId={
              selectedLocationId
            }
            currency={
              currency
            }
            onSelectLocationAction={
              setSelectedLocationId
            }
            onClearSelectionAction={() =>
              setSelectedLocationId(
                undefined,
              )
            }
            onModifyLocationAction={
              handleModify
            }
          />
        </div>
      </div>

      {/* Optimize */}
      <div className="flex justify-center pt-1">
        <MapRouteOptimizer
          onOptimizeAction={
            handleOptimize
          }
        />
      </div>
    </div>
  );
}