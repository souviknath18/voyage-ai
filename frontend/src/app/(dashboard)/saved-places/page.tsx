"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import SavedPlacesFilters from "@/components/saved-places/SavedPlacesFilters";
import SavedPlacesGrid from "@/components/saved-places/SavedPlacesGrid";
import SavedPlacesHeader from "@/components/saved-places/SavedPlacesHeader";
import SavedPlacesSelectionBar from "@/components/saved-places/SavedPlacesSelectionBar";

import {
  getSavedTripPlaces,
  updateTripPlaceSavedStatus,
} from "@/lib/trips";

import { mapSavedTripPlace } from "@/lib/saved-place-mappers";

import type {
  SavedPlace,
  SavedPlaceCategory,
} from "@/types/saved-places";

export default function SavedPlacesPage() {
  const router = useRouter();

  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState<SavedPlaceCategory>("all");
  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  const [removingIds, setRemovingIds] =
    useState<string[]>([]);

  useEffect(() => {
    let active = true;

    async function loadSavedPlaces() {
      try {
        setLoading(true);
        setError(null);

        const response = await getSavedTripPlaces();

        if (active) {
          setPlaces(response.map(mapSavedTripPlace));
        }
      } catch (err) {
        console.error("Failed to load saved places:", err);

        if (active) {
          setError("Unable to load saved places.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSavedPlaces();

    return () => {
      active = false;
    };
  }, []);

  const visiblePlaces = useMemo(() => {
    let result = places;

    if (category !== "all") {
      result = result.filter(
        (place) => place.category === category,
      );
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter(
        (place) =>
          place.name.toLowerCase().includes(query) ||
          place.city.toLowerCase().includes(query) ||
          place.country.toLowerCase().includes(query),
      );
    }

    return result;
  }, [places, category, search]);

  const handleSelect = (id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const handleRemove = async (id: string) => {
    if (removingIds.includes(id)) {
      return;
    }

    const place = places.find((item) => item.id === id);

    if (!place) {
      return;
    }

    setRemovingIds((previous) => [...previous, id]);

    // Optimistically remove the card.
    setPlaces((previous) =>
      previous.filter((item) => item.id !== id),
    );

    setSelectedIds((previous) =>
      previous.filter((item) => item !== id),
    );

    try {
      await updateTripPlaceSavedStatus(
        place.tripId,
        place.id,
        false,
      );
    } catch (err) {
      console.error("Failed to remove saved place:", err);

      // Restore the card if the request fails.
      setPlaces((previous) => {
        if (previous.some((item) => item.id === id)) {
          return previous;
        }

        return [...previous, place];
      });

      setError("Unable to remove the saved place.");
    } finally {
      setRemovingIds((previous) =>
        previous.filter((item) => item !== id),
      );
    }
  };

  const handleDetails = (id: string) => {
    const place = places.find((item) => item.id === id);

    if (!place) {
      return;
    }

    // Until a dedicated place details page exists,
    // navigate to the owning trip's Places tab.
    router.push(
      `/trips/${encodeURIComponent(place.tripId)}/places`,
    );
  };

  const handleCreateTrip = () => {
    // The existing trip creation page does not yet
    // accept preselected places.
    router.push("/plan-trip");
  };

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-24 md:px-6">
        <div className="space-y-6">
          <SavedPlacesHeader
            search={search}
            onSearchChangeAction={setSearch}
          />

          <SavedPlacesFilters
            activeCategory={category}
            onChangeAction={setCategory}
          />

          {error && (
            <p role="alert" className="text-sm text-[#fb7185]">
              {error}
            </p>
          )}

          {loading ? (
            <div className="py-16 text-center text-sm text-[#948e9c]">
              Loading saved places...
            </div>
          ) : (
            <SavedPlacesGrid
              places={visiblePlaces}
              selectedIds={selectedIds}
              onSelectAction={handleSelect}
              onRemoveAction={(id) => {
                void handleRemove(id);
              }}
              onDetailsAction={handleDetails}
            />
          )}
        </div>
      </div>

      <SavedPlacesSelectionBar
        count={selectedIds.length}
        onClearAction={() => setSelectedIds([])}
        onCreateTripAction={handleCreateTrip}
      />
    </AppLayout>
  );
}