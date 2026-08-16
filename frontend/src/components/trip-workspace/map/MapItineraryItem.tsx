"use client";

import {
  BedDouble,
  Camera,
  Car,
  Clock3,
  MapPin,
  ShoppingBag,
  Sparkles,
  Utensils,
} from "lucide-react";

import type {
  TripMapLocation,
} from "@/types/trip-workspace";

interface MapItineraryItemProps {
  location: TripMapLocation;

  active: boolean;

  last: boolean;

  onSelectAction: (
    id: string,
  ) => void;
}

const icons = {
  attraction: Camera,
  food: Utensils,
  hotel: BedDouble,
  transport: Car,
  shopping: ShoppingBag,
  experience: Sparkles,
};

export default function MapItineraryItem({
  location,
  active,
  last,
  onSelectAction,
}: MapItineraryItemProps) {
  const Icon =
    icons[location.type];

  return (
    <button
      type="button"
      onClick={() =>
        onSelectAction(
          location.id,
        )
      }
      className="group relative flex w-full gap-3 text-left"
    >
      {/* Timeline */}
      <div className="relative flex shrink-0 flex-col items-center">
        <div
          className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border transition ${
            active
              ? "border-[#fb7185]/50 bg-[#fb7185]/15 text-[#fb7185] shadow-[0_0_15px_rgba(251,113,133,0.18)]"
              : "border-white/10 bg-[#0D1324] text-[#948e9c]"
          }`}
        >
          <Icon size={15} />
        </div>

        {!last && (
          <div className="absolute bottom-0 left-1/2 top-9 w-px -translate-x-1/2 bg-white/10" />
        )}
      </div>

      {/* Card */}
      <div
        className={`mb-3 min-w-0 flex-1 rounded-lg border p-3 transition ${
          active
            ? "border-[#fb7185]/30 bg-[#fb7185]/[0.06]"
            : "border-white/10 bg-white/[0.03] group-hover:bg-white/[0.05]"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="truncate text-sm font-medium text-[#e6e0e8]">
              {location.name}
            </h4>

            {location.subtitle && (
              <p className="mt-1 truncate text-xs text-[#948e9c]">
                {location.subtitle}
              </p>
            )}
          </div>

          <span
            className={`shrink-0 text-[10px] font-semibold ${
              active
                ? "text-[#fb7185]"
                : "text-[#7f8798]"
            }`}
          >
            {location.time}
          </span>
        </div>

        {location.transportToNext &&
          !last && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#7f8798]">
              <Clock3 size={11} />

              {
                location
                  .transportToNext
                  .duration
              }{" "}
              to next stop
            </div>
          )}

        <div className="mt-2 flex items-center gap-1 text-[10px] text-[#7f8798]">
          <MapPin size={11} />

          Day {location.dayNumber}
        </div>
      </div>
    </button>
  );
}