"use client";

import {
  Clock3,
  MapPin,
  WalletCards,
  X,
} from "lucide-react";

import {
  Button,
  ThumbnailImage,
} from "@/components/ui";

import type {
  TripMapLocation,
} from "@/types/trip-workspace";

interface MapPlacePopupProps {
  location:
    TripMapLocation;

  currency: string;

  onCloseAction: () => void;

  onModifyAction: (
    id: string,
  ) => void;
}

export default function MapPlacePopup({
  location,
  currency,
  onCloseAction,
  onModifyAction,
}: MapPlacePopupProps) {
  return (
    <div className="w-[260px] overflow-hidden rounded-xl border border-white/10 bg-[#070B18]/90 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:w-[290px]">
      {/* Image */}
      <ThumbnailImage
        src={location.image}
        alt={location.name}
        className="h-28 w-full rounded-lg"
      />

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[#e6e0e8]">
            {location.name}
          </h3>

          {location.subtitle && (
            <p className="mt-1 text-xs text-[#948e9c]">
              {location.subtitle}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={
            onCloseAction
          }
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#948e9c] transition hover:bg-white/[0.06] hover:text-white"
        >
          <X size={14} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] text-[#948e9c]">
        <span className="flex items-center gap-1">
          <Clock3 size={11} />

          {location.time}

          {location.duration &&
            ` • ${location.duration}`}
        </span>

        {location.estimatedCost !==
          undefined && (
          <span className="flex items-center gap-1">
            <WalletCards
              size={11}
            />

            {location.estimatedCost >
            0
              ? `${currency} ${location.estimatedCost.toLocaleString()}`
              : "Free"}
          </span>
        )}

        <span className="flex items-center gap-1">
          <MapPin size={11} />

          Day {location.dayNumber}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        fullWidth
        className="mt-4"
        onClick={() =>
          onModifyAction(
            location.id,
          )
        }
      >
        Modify Plan
      </Button>
    </div>
  );
}