"use client";

import { Card } from "@/components/ui";

import {
  Activity,
  Scale,
  Coffee,
} from "lucide-react";

import { TravelPace } from "@/types/trip";

interface TravelPaceSelectorProps {
  value: TravelPace;
  onChangeAction: (value: TravelPace) => void;
}

const paces = [
  {
    value: "relaxed" as TravelPace,
    label: "Relaxed",
    icon: Coffee,
  },
  {
    value: "balanced" as TravelPace,
    label: "Balanced",
    icon: Scale,
  },
  {
    value: "packed" as TravelPace,
    label: "Packed",
    icon: Activity,
  },
];

export default function TravelPaceSelector({
  value,
  onChangeAction,
}: TravelPaceSelectorProps) {
  return (
    <Card className="p-4 sm:p-5">
      <h2 className="mb-4 text-base font-semibold text-[#e6e0e8] sm:text-lg">
        Travel Pace
      </h2>

      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
        {paces.map((pace) => {
          const Icon = pace.icon;
          const active = value === pace.value;

          return (
            <button
              key={pace.value}
              type="button"
              onClick={() =>
                onChangeAction(pace.value)
              }
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs transition-all min-[420px]:flex-col min-[420px]:gap-1.5 min-[420px]:px-2 min-[420px]:py-3 ${
                active
                  ? "border-[#fb7185] bg-[#fb7185]/15 text-[#fb7185] shadow-[inset_0_0_10px_rgba(251,113,133,0.1)]"
                  : "border-white/10 bg-white/[0.04] text-[#948e9c] hover:bg-white/[0.07] hover:text-[#cbc4d2]"
              }`}
            >
              <Icon
                size={17}
                className="shrink-0 sm:size-[18px]"
              />

              <span className="text-xs font-medium min-[420px]:text-[11px]">
                {pace.label}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}