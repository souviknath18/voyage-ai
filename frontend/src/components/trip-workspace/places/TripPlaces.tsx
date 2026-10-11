"use client";

import { useParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import ConfirmModal from "@/components/ui/ConfirmModal";
import Dropdown from "@/components/ui/Dropdown";
import TimePicker from "@/components/ui/TimePicker";

import {
  addPlaceToItinerary,
  getTripItinerary,
  getTripPlaces,
  removeItineraryActivity,
  updateTripPlaceSavedStatus,
} from "@/lib/trips";

import type {
  TripItinerary,
  TripPlace as ApiTripPlace,
} from "@/lib/trips";

import { mapTripPlaces } from "@/lib/place-mappers";

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
  alternatives: TripPlaceAlternative[];
  currency: string;
}

export default function TripPlaces({
  places,
  alternatives,
  currency,
}: TripPlacesProps) {
  const params = useParams();
  const tripId = params.tripId as string;

  const [addingPlaceId, setAddingPlaceId] =
    useState<string | null>(null);

  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [submitting, setSubmitting] = useState(false);

  const [availableDays, setAvailableDays] =
    useState<number[]>([]);

  const [activeFilter, setActiveFilter] =
    useState<TripPlaceFilter>("all");

  const [localPlaces, setLocalPlaces] =
    useState<TripPlace[]>(places);

  const [savingPlaceIds, setSavingPlaceIds] =
    useState<string[]>([]);

  const [removingPlaceId, setRemovingPlaceId] =
    useState<string | null>(null);

  const [loadingItineraryDays, setLoadingItineraryDays] =
    useState(false);

  const savingIdsRef = useRef<Set<string>>(new Set());

  const cachedItineraryRef = useRef<TripItinerary | null>(null);

  const cachedApiPlacesRef = useRef<ApiTripPlace[] | null>(null);

  const savedOverridesRef = useRef<Map<string, boolean>>(
    new Map(),
  );

  useEffect(() => {
    setLocalPlaces((currentPlaces) =>
      places.map((place) => {
        const currentPlace = currentPlaces.find(
          (item) => item.id === place.id,
        );

        const saved =
          savedOverridesRef.current.get(place.id) ??
          place.saved;

        return {
          ...place,
          saved,
          status:
            currentPlace?.status === "planned"
              ? "planned"
              : saved
                ? "saved"
                : "optional",
          itineraryDay:
            currentPlace?.itineraryDay ??
            place.itineraryDay,
        };
      }),
    );
  }, [places]);

  const visiblePlaces = useMemo(() => {
    if (activeFilter === "all") {
      return localPlaces;
    }

    if (activeFilter === "saved") {
      return localPlaces.filter((place) => place.saved);
    }

    return localPlaces.filter(
      (place) => place.category === activeFilter,
    );
  }, [localPlaces, activeFilter]);

  const savedPlaces = localPlaces.filter(
    (place) => place.saved,
  ).length;

  const plannedPlaces = localPlaces.filter(
    (place) => place.status === "planned",
  ).length;

  const estimatedSpend = localPlaces
    .filter((place) => place.status === "planned")
    .reduce(
      (total, place) => total + place.estimatedCost,
      0,
    );

  const coverage =
    localPlaces.length > 0
      ? Math.round(
          (plannedPlaces / localPlaces.length) * 100,
        )
      : 0;

  const refreshPlaces = async () => {
    const [apiPlaces, itinerary] = await Promise.all([
      getTripPlaces(tripId),
      getTripItinerary(tripId),
    ]);

    cachedApiPlacesRef.current = apiPlaces;
    cachedItineraryRef.current = itinerary;

    setLocalPlaces((previous) => {
      const images = Object.fromEntries(
        previous
          .filter((place) => place.image)
          .map((place) => [place.id, place.image!]),
      );

      return mapTripPlaces(
        apiPlaces,
        itinerary,
        images,
      ).map((place) => ({
        ...place,
        saved:
          savedOverridesRef.current.get(place.id) ??
          place.saved,
      }));
    });
  };

  const handleSave = async (id: string) => {
    if (savingIdsRef.current.has(id)) return;

    const place = localPlaces.find(
      (item) => item.id === id,
    );

    if (!place || !tripId) return;

    const previousSaved = place.saved;
    const nextSaved = !previousSaved;

    savingIdsRef.current.add(id);
    setSavingPlaceIds((previous) => [...previous, id]);

    savedOverridesRef.current.set(id, nextSaved);

    setLocalPlaces((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              saved: nextSaved,
              status:
                item.status === "planned"
                  ? "planned"
                  : nextSaved
                    ? "saved"
                    : "optional",
            }
          : item,
      ),
    );

    try {
      const updatedPlace =
        await updateTripPlaceSavedStatus(
          tripId,
          id,
          nextSaved,
        );

      savedOverridesRef.current.set(
        id,
        updatedPlace.is_saved,
      );

      setLocalPlaces((previous) =>
        previous.map((item) =>
          item.id === id
            ? {
                ...item,
                saved: updatedPlace.is_saved,
                status:
                  item.status === "planned"
                    ? "planned"
                    : updatedPlace.is_saved
                      ? "saved"
                      : "optional",
              }
            : item,
        ),
      );
    } catch (error) {
      savedOverridesRef.current.set(
        id,
        previousSaved,
      );

      setLocalPlaces((previous) =>
        previous.map((item) =>
          item.id === id
            ? {
                ...item,
                saved: previousSaved,
                status:
                  item.status === "planned"
                    ? "planned"
                    : previousSaved
                      ? "saved"
                      : "optional",
              }
            : item,
        ),
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update bookmark.",
      );
    } finally {
      savingIdsRef.current.delete(id);

      setSavingPlaceIds((previous) =>
        previous.filter((placeId) => placeId !== id),
      );
    }
  };

  const handleAdd = async (id: string) => {
    if (submitting || loadingItineraryDays) return;

    // Open the modal immediately.
    setAddingPlaceId(id);
    setAvailableDays([]);
    setSelectedTime("10:00");
    setLoadingItineraryDays(true);

    try {
      const itinerary = await getTripItinerary(tripId);
      cachedItineraryRef.current = itinerary;

      const days = itinerary.days.map(
        (day) => day.day_number,
      );

      if (days.length === 0) {
        toast.error("No itinerary days are available.");
        setAddingPlaceId(null);
        return;
      }

      setAvailableDays(days);
      setSelectedDay(days[0]);
    } catch (error) {
      setAddingPlaceId(null);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load itinerary days.",
      );
    } finally {
      setLoadingItineraryDays(false);
    }
  };

  const confirmAddPlace = async () => {
    if (
      !addingPlaceId ||
      submitting ||
      loadingItineraryDays
    ) {
      return;
    }

    try {
      setSubmitting(true);

      await addPlaceToItinerary(tripId, {
        place_id: addingPlaceId,
        day_number: selectedDay,
        time: selectedTime,
        duration_minutes: 60,
      });

      setAddingPlaceId(null);
      toast.success("Place added to itinerary.");

      try {
        await refreshPlaces();
      } catch {
        toast.warning(
          "Place added, but the list could not refresh. Reload the page to see the latest itinerary.",
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add place.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = (id: string) => {
    if (submitting) return;

    setRemovingPlaceId(id);
  };

  const confirmRemovePlace = async () => {
    if (!removingPlaceId || submitting) return;

    const placeId = removingPlaceId;

    try {
      setSubmitting(true);

      // Reuse cached data when available.
      const [apiPlaces, itinerary] = await Promise.all([
        cachedApiPlacesRef.current
          ? Promise.resolve(cachedApiPlacesRef.current)
          : getTripPlaces(tripId),
        cachedItineraryRef.current
          ? Promise.resolve(cachedItineraryRef.current)
          : getTripItinerary(tripId),
      ]);

      cachedApiPlacesRef.current = apiPlaces;
      cachedItineraryRef.current = itinerary;

      const place = apiPlaces.find(
        (item) => item.id === placeId,
      );

      if (!place) {
        throw new Error("Place not found.");
      }

      const activity = itinerary.days
        .flatMap((day) => day.activities)
        .find(
          (item) =>
            item.place_id === place.id ||
            item.place_id === place.provider_place_id,
        );

      if (!activity) {
        throw new Error(
          "This place is not in the current itinerary.",
        );
      }

      // Invalidate before mutation, because activity IDs
      // may change when a new itinerary version is created.
      cachedItineraryRef.current = null;

      await removeItineraryActivity(
        tripId,
        activity.id,
      );

      setRemovingPlaceId(null);
      toast.success("Place removed from itinerary.");

      try {
        await refreshPlaces();
      } catch {
        toast.warning(
          "Place removed, but the list could not refresh. Reload the page to see the latest itinerary.",
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to remove place.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplace = (id: string) => {
    console.log("Replace place:", id);
  };

  const handleAlternative = (id: string) => {
    console.log("Review alternative:", id);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#e6e0e8] sm:text-xl">
          Places in Your Trip
        </h2>

        <p className="mt-1 max-w-2xl text-sm leading-5 text-[#948e9c]">
          Places selected around your interests, budget and
          itinerary efficiency.
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
        activeFilter={activeFilter}
        onChangeAction={setActiveFilter}
      />

      {/* Places */}
      {visiblePlaces.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visiblePlaces.map((place) => (
            <TripPlaceCard
              key={place.id}
              place={place}
              currency={currency}
              onSaveAction={handleSave}
              onRemoveAction={handleRemove}
              onReplaceAction={handleReplace}
              onAddAction={handleAdd}
            />
          ))}
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
          alternatives={alternatives}
          currency={currency}
          onApplyAction={handleAlternative}
        />
      </div>

      {/* Reusable Add Place Modal */}
      <ConfirmModal
        open={addingPlaceId !== null}
        onOpenChangeAction={(open) => {
          if (!open && !submitting) {
            setAddingPlaceId(null);
          }
        }}
        title="Add to Itinerary"
        description={
          loadingItineraryDays
            ? "Loading itinerary days..."
            : "Choose the day and time for this place."
        }
        confirmText="Add Place"
        loading={submitting}
        confirmDisabled={
          loadingItineraryDays ||
          availableDays.length === 0 ||
          !selectedTime
        }
        onConfirmAction={confirmAddPlace}
      >
        {/* Create Plan-style Dropdown */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#e6e0e8]">
            Itinerary Day
          </label>

          <Dropdown
            value={String(selectedDay)}
            onChangeAction={(value) => {
              setSelectedDay(Number(value));
            }}
            options={availableDays.map((day) => ({
              label: `Day ${day}`,
              value: String(day),
            }))}
            placeholder="Select itinerary day"
            disabled={submitting || loadingItineraryDays}
          />
        </div>

        {/* Start Time */}
        <TimePicker
          label="Start Time"
          value={selectedTime}
          onChangeAction={setSelectedTime}
          disabled={submitting || loadingItineraryDays}
        />
      </ConfirmModal>

      <ConfirmModal
        open={removingPlaceId !== null}
        onOpenChangeAction={(open) => {
          if (!open && !submitting) {
            setRemovingPlaceId(null);
          }
        }}
        title="Remove from Itinerary?"
        description={
          removingPlaceId
            ? `Are you sure you want to remove "${
                localPlaces.find(
                  (place) => place.id === removingPlaceId,
                )?.name ?? "this place"
              }" from your itinerary? A new itinerary version will be created.`
            : ""
        }
        confirmText="Remove Place"
        cancelText="Cancel"
        destructive
        loading={submitting}
        onConfirmAction={confirmRemovePlace}
      />
    </div>
  );
}