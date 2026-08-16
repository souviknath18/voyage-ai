"use client";

import {
  Bookmark,
} from "lucide-react";

import type {
  SavedPlace,
} from "@/types/saved-places";

import SavedPlaceCard from "./SavedPlaceCard";

interface SavedPlacesGridProps {
  places: SavedPlace[];

  selectedIds: string[];

  onSelectAction: (
    id: string,
  ) => void;

  onRemoveAction: (
    id: string,
  ) => void;

  onDetailsAction: (
    id: string,
  ) => void;
}

export default function SavedPlacesGrid({
  places,
  selectedIds,
  onSelectAction,
  onRemoveAction,
  onDetailsAction,
}: SavedPlacesGridProps) {
  if (
    places.length === 0
  ) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-16 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#d1bcff]">
          <Bookmark size={19} />
        </div>

        <h2 className="mt-4 text-base font-semibold text-[#e6e0e8]">
          No saved places
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-[#948e9c]">
          Save destinations and experiences while exploring VoyageAI and they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {places.map(
        (place) => (
          <SavedPlaceCard
            key={
              place.id
            }
            place={place}
            selected={selectedIds.includes(
              place.id,
            )}
            onSelectAction={
              onSelectAction
            }
            onRemoveAction={
              onRemoveAction
            }
            onDetailsAction={
              onDetailsAction
            }
          />
        ),
      )}
    </div>
  );
}