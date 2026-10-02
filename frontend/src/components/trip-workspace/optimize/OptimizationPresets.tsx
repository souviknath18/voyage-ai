"use client";

import {
  Armchair,
  Clock3,
  DollarSign,
  Plus,
} from "lucide-react";

import type {
  OptimizationPreset,
} from "@/types/trip-workspace";

import OptimizationPresetCard from "./OptimizationPresetCard";

interface OptimizationPresetsProps {
  selected:
    OptimizationPreset[];

  onToggleAction: (
    preset: OptimizationPreset,
  ) => void;
}

const presets = [
  {
    id: "cheaper" as OptimizationPreset,
    label: "Make It Cheaper",
    icon: DollarSign,
  },
  {
    id: "more_comfortable" as OptimizationPreset,
    label: "More Comfortable",
    icon: Armchair,
  },
  {
    id: "less_busy" as OptimizationPreset,
    label: "Less Busy",
    icon: Clock3,
  },
  {
    id: "more_activities" as OptimizationPreset,
    label: "More Activities",
    icon: Plus,
  },
];

export default function OptimizationPresets({
  selected,
  onToggleAction,
}: OptimizationPresetsProps) {
  return (
    <section>
      <div>
        <h2 className="text-base font-semibold text-[#e6e0e8] sm:text-lg">
          Quick Adjustments
        </h2>

        <p className="mt-1 text-xs text-[#948e9c]">
          Choose an area you want VoyageAI to improve.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {presets.map(
          (preset) => (
            <OptimizationPresetCard
              key={
                preset.id
              }
              label={
                preset.label
              }
              icon={
                preset.icon
              }
              active={selected.includes(
                preset.id,
              )}
              onClickAction={() =>
                onToggleAction(
                  preset.id,
                )
              }
            />
          ),
        )}
      </div>
    </section>
  );
}