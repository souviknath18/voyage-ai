"use client";

import {
  ArrowRight,
  BookmarkMinus,
  Check,
  MapPin,
} from "lucide-react";

import {
  DestinationImage,
} from "@/components/ui";

import type {
  SavedPlace,
} from "@/types/saved-places";

interface SavedPlaceCardProps {
  place: SavedPlace;

  selected: boolean;

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

export default function SavedPlaceCard({
  place,
  selected,
  onSelectAction,
  onRemoveAction,
  onDetailsAction,
}: SavedPlaceCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-[#fb7185]/25 hover:bg-white/[0.05]">
      {/* Selection */}
      <button
        type="button"
        onClick={() =>
          onSelectAction(
            place.id,
          )
        }
        aria-label="Select place"
        className={`absolute left-3 top-3 z-20 flex h-6 w-6 items-center justify-center rounded-md border backdrop-blur-xl transition ${
          selected
            ? "border-[#fb7185]/50 bg-[#fb7185]/20 text-[#fb7185]"
            : "border-white/15 bg-black/40 text-transparent hover:border-[#fb7185]/40"
        }`}
      >
        <Check size={14} />
      </button>

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <DestinationImage
          src={place.image}
          alt={place.name}
          className="absolute inset-0 h-full w-full"
          imageClassName="object-center transition-transform duration-700 group-hover:scale-[1.05]"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B18] via-transparent to-black/20" />

        {/* Category */}
        <div className="absolute right-3 top-3 z-20">
          <span className="rounded-md border border-white/10 bg-black/50 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#fcd34d] backdrop-blur-xl">
            {place.categoryLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-6 z-10 flex flex-1 flex-col p-4">
        <div>
          <h2 className="truncate text-base font-semibold text-[#e6e0e8]">
            {place.name}
          </h2>

          <p className="mt-1 flex items-center gap-1.5 text-xs text-[#d1bcff]">
            <MapPin size={12} />

            {place.city},{" "}
            {place.country}
          </p>
        </div>

        <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#948e9c]">
          {place.description}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#7f8798]">
            Saved{" "}
            {place.savedDate}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                onRemoveAction(
                  place.id,
                )
              }
              aria-label="Remove saved place"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#948e9c] transition hover:bg-white/[0.06] hover:text-[#fb7185]"
            >
              <BookmarkMinus
                size={15}
              />
            </button>

            <button
              type="button"
              onClick={() =>
                onDetailsAction(
                  place.id,
                )
              }
              className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-semibold text-[#cbc4d2] transition hover:border-white/25 hover:bg-white/[0.05]"
            >
              Details

              <ArrowRight
                size={12}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}