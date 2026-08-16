"use client";

import {
  Route,
} from "lucide-react";

import type {
  TripMapLocation,
} from "@/types/trip-workspace";

import MapItineraryItem from "./MapItineraryItem";

interface MapItineraryPanelProps {
  locations: TripMapLocation[];

  selectedLocationId?:
    string;

  title: string;

  subtitle: string;

  onSelectLocationAction: (
    id: string,
  ) => void;
}

export default function MapItineraryPanel({
  locations,
  selectedLocationId,
  title,
  subtitle,
  onSelectLocationAction,
}: MapItineraryPanelProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#070B18]/80 backdrop-blur-xl">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-2">
          <Route
            size={17}
            className="text-[#fb7185]"
          />

          <h3 className="text-sm font-semibold text-[#e6e0e8]">
            {title}
          </h3>
        </div>

        <p className="mt-1 text-xs text-[#948e9c]">
          {subtitle}
        </p>
      </div>

      {/* Stops */}
      <div className="flex-1 overflow-y-auto p-4 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10">
        {locations.length > 0 ? (
          locations.map(
            (
              location,
              index,
            ) => (
              <MapItineraryItem
                key={
                  location.id
                }
                location={
                  location
                }
                active={
                  selectedLocationId ===
                  location.id
                }
                last={
                  index ===
                  locations.length -
                    1
                }
                onSelectAction={
                  onSelectLocationAction
                }
              />
            ),
          )
        ) : (
          <div className="py-10 text-center">
            <p className="text-sm font-medium text-[#e6e0e8]">
              No mapped places
            </p>

            <p className="mt-1 text-xs text-[#948e9c]">
              This day has no locations yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}