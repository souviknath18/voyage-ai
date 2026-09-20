"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  TripPlace,
  TripPlaceAlternative,
  TripPlaceFilter,
} from "@/types/trip-workspace";

import PlaceAlternatives from "./PlaceAlternatives";
import PlacesFilters from "./PlacesFilters";
import PlacesSummary from "./PlacesSummary";
import TripPlaceCard from "./TripPlaceCard";

interface TripPlacesProps {
  places: TripPlace[];

  alternatives:
    TripPlaceAlternative[];

  currency: string;
}

export default function TripPlaces({
  places,
  alternatives,
  currency,
}: TripPlacesProps) {
  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState<TripPlaceFilter>(
      "all",
    );

  const [
    localPlaces,
    setLocalPlaces,
  ] =
    useState<TripPlace[]>(
      places,
    );

  const visiblePlaces =
    useMemo(() => {
      if (
        activeFilter ===
        "all"
      ) {
        return localPlaces;
      }

      if (
        activeFilter ===
        "saved"
      ) {
        return localPlaces.filter(
          (place) =>
            place.saved,
        );
      }

      return localPlaces.filter(
        (place) =>
          place.category ===
          activeFilter,
      );
    }, [
      localPlaces,
      activeFilter,
    ]);

  const savedPlaces =
    localPlaces.filter(
      (place) =>
        place.saved,
    ).length;

  const estimatedSpend =
    localPlaces
      .filter(
        (place) =>
          place.status ===
          "planned",
      )
      .reduce(
        (
          total,
          place,
        ) =>
          total +
          place.estimatedCost,
        0,
      );

  const plannedPlaces =
    localPlaces.filter(
      (place) =>
        place.status === "planned",
    ).length;

  const coverage =
    localPlaces.length > 0
      ? Math.round(
          (plannedPlaces /
            localPlaces.length) *
            100,
        )
      : 0;

  const handleSave = (
    id: string,
  ) => {
    setLocalPlaces(
      (previous) =>
        previous.map(
          (place) =>
            place.id === id
              ? {
                  ...place,

                  saved:
                    !place.saved,

                  status:
                    !place.saved &&
                    place.status !==
                      "planned"
                      ? "saved"
                      : place.status ===
                          "saved"
                        ? "optional"
                        : place.status,
                }
              : place,
        ),
    );
  };

  const handleRemove = (
    id: string,
  ) => {
    setLocalPlaces(
      (previous) =>
        previous.map(
          (place) =>
            place.id === id
              ? {
                  ...place,
                  status:
                    "optional",
                  itineraryDay:
                    undefined,
                }
              : place,
        ),
    );
  };

  const handleAdd = (
    id: string,
  ) => {
    console.log(
      "Add place:",
      id,
    );
  };

  const handleReplace = (
    id: string,
  ) => {
    console.log(
      "Replace place:",
      id,
    );
  };

  const handleAlternative =
    (
      id: string,
    ) => {
      console.log(
        "Review alternative:",
        id,
      );
    };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#e6e0e8] sm:text-xl">
          Places in Your Trip
        </h2>

        <p className="mt-1 max-w-2xl text-sm leading-5 text-[#948e9c]">
          Places selected around your interests, budget and itinerary efficiency.
        </p>
      </div>

      {/* Summary */}
      <PlacesSummary
        totalPlaces={localPlaces.length}
        savedPlaces={savedPlaces}
        estimatedSpend={estimatedSpend}
        coverage={coverage}
        currency={currency}
      />

      {/* Filters */}
      <PlacesFilters
        activeFilter={
          activeFilter
        }
        onChangeAction={
          setActiveFilter
        }
      />

      {/* Places */}
      {visiblePlaces.length >
      0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visiblePlaces.map(
            (place) => (
              <TripPlaceCard
                key={
                  place.id
                }
                place={
                  place
                }
                currency={
                  currency
                }
                onSaveAction={
                  handleSave
                }
                onRemoveAction={
                  handleRemove
                }
                onReplaceAction={
                  handleReplace
                }
                onAddAction={
                  handleAdd
                }
              />
            ),
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-14 text-center">
          <h3 className="text-sm font-semibold text-[#e6e0e8]">
            No places found
          </h3>

          <p className="mt-2 text-xs text-[#948e9c]">
            Try another category or view all places.
          </p>
        </div>
      )}

      {/* Alternatives */}
      <div className="pt-2">
        <PlaceAlternatives
          alternatives={
            alternatives
          }
          currency={
            currency
          }
          onApplyAction={
            handleAlternative
          }
        />
      </div>
    </div>
  );
}