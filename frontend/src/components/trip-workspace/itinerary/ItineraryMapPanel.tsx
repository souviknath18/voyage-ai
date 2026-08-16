import {
  Map,
  MapPin,
  Route,
} from "lucide-react";

import {
  Card,
} from "@/components/ui";

import type {
  ItineraryDayData,
} from "@/types/trip-workspace";

interface ItineraryMapPanelProps {
  day: ItineraryDayData;
}

export default function ItineraryMapPanel({
  day,
}: ItineraryMapPanelProps) {
  return (
    <Card className="sticky top-[76px] overflow-hidden p-0">
      {/* Map Preview */}
      <div className="relative h-[320px] overflow-hidden bg-gradient-to-br from-[#11182b] via-[#0D1324] to-[#19132a] lg:h-[420px]">
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:30px_30px]" />

        {/* Glow */}
        <div className="absolute left-1/3 top-1/4 h-32 w-32 rounded-full bg-[#fb7185]/10 blur-3xl" />

        <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-[#d1bcff]/10 blur-3xl" />

        {/* Route */}
        <div className="absolute left-[28%] top-[25%] h-[50%] w-px rotate-[15deg] border-l border-dashed border-[#fb7185]/50" />

        {/* Markers */}
        {day.activities
          .slice(0, 4)
          .map(
            (
              activity,
              index,
            ) => {
              const positions = [
                "left-[25%] top-[22%]",
                "left-[48%] top-[42%]",
                "left-[36%] top-[62%]",
                "left-[65%] top-[70%]",
              ];

              return (
                <div
                  key={
                    activity.id
                  }
                  className={`absolute ${
                    positions[
                      index
                    ]
                  }`}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#070B18] bg-[#fb7185] text-[10px] font-bold text-[#24005b] shadow-[0_0_15px_rgba(251,113,133,0.45)]">
                    {index + 1}
                  </div>
                </div>
              );
            },
          )}

        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center text-center opacity-40">
            <Map
              size={34}
              className="text-[#d1bcff]"
            />

            <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#948e9c]">
              Map Preview
            </span>
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <Route
            size={15}
            className="text-[#fb7185]"
          />

          <h3 className="text-sm font-semibold text-[#e6e0e8]">
            Day {day.dayNumber} Route
          </h3>
        </div>

        <div className="mt-3 space-y-2">
          {day.activities
            .slice(0, 4)
            .map(
              (
                activity,
                index,
              ) => (
                <div
                  key={
                    activity.id
                  }
                  className="flex items-center gap-2 text-xs text-[#948e9c]"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fb7185]/10 text-[9px] font-semibold text-[#fb7185]">
                    {index + 1}
                  </span>

                  <MapPin
                    size={11}
                  />

                  <span className="truncate">
                    {activity.title}
                  </span>
                </div>
              ),
            )}
        </div>
      </div>
    </Card>
  );
}