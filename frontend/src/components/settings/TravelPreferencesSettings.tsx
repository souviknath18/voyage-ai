"use client";

import {
  BedDouble,
  Check,
  Gauge,
  Salad,
} from "lucide-react";

import {
  Card,
  Dropdown,
} from "@/components/ui";

import type {
  AccommodationPreference,
  TravelPace,
} from "@/types/settings";

interface TravelPreferencesSettingsProps {
  travelPace: TravelPace;

  accommodationPreferences:
    AccommodationPreference[];

  dietaryRequirement: string;

  onTravelPaceChangeAction: (
    value: TravelPace,
  ) => void;

  onAccommodationChangeAction: (
    value:
      AccommodationPreference,
  ) => void;

  onDietaryChangeAction: (
    value: string,
  ) => void;
}

const paceOptions: {
  value: TravelPace;
  label: string;
}[] = [
  {
    value: "slow",
    label: "Slow & Immersive",
  },
  {
    value: "balanced",
    label: "Balanced",
  },
  {
    value: "fast",
    label: "Fast & Comprehensive",
  },
];

const accommodationOptions: {
  value:
    AccommodationPreference;
  label: string;
}[] = [
  {
    value: "boutique",
    label: "Boutique",
  },
  {
    value: "budget",
    label: "Budget",
  },
  {
    value: "luxury",
    label: "Luxury",
  },
  {
    value: "hostel",
    label: "Hostel",
  },
  {
    value: "eco",
    label: "Eco-lodge",
  },
];

const dietaryOptions = [
  {
    label: "None",
    value: "none",
  },
  {
    label: "Vegetarian",
    value: "vegetarian",
  },
  {
    label: "Vegan",
    value: "vegan",
  },
  {
    label: "Halal",
    value: "halal",
  },
  {
    label: "Gluten-Free",
    value: "gluten-free",
  },
];

export default function TravelPreferencesSettings({
  travelPace,
  accommodationPreferences,
  dietaryRequirement,
  onTravelPaceChangeAction,
  onAccommodationChangeAction,
  onDietaryChangeAction,
}: TravelPreferencesSettingsProps) {
  return (
    <section
      id="travel-preferences"
      className="scroll-mt-24"
    >
      <div className="mb-3 flex items-center gap-2">
        <Gauge
          size={16}
          className="text-[#d1bcff]"
        />

        <h2 className="text-base font-semibold text-[#e6e0e8]">
          Travel Preferences
        </h2>
      </div>

      <Card className="space-y-6 p-4 sm:p-5">
        {/* Pace */}
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wider text-[#7f8798]">
            Travel Pace
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {paceOptions.map(
              (option) => {
                const active =
                  travelPace ===
                  option.value;

                return (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      onTravelPaceChangeAction(
                        option.value,
                      )
                    }
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      active
                        ? "border-[#fb7185]/40 bg-[#fb7185]/10 text-[#fb7185]"
                        : "border-white/10 bg-white/[0.03] text-[#948e9c] hover:bg-white/[0.05] hover:text-[#cbc4d2]"
                    }`}
                  >
                    {active && (
                      <Check
                        size={12}
                      />
                    )}

                    {option.label}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* Accommodation */}
        <div className="border-t border-white/10 pt-5">
          <div className="flex items-center gap-1.5">
            <BedDouble
              size={13}
              className="text-[#7f8798]"
            />

            <p className="text-[9px] font-semibold uppercase tracking-wider text-[#7f8798]">
              Preferred Accommodation
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {accommodationOptions.map(
              (option) => {
                const active =
                  accommodationPreferences.includes(
                    option.value,
                  );

                return (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      onAccommodationChangeAction(
                        option.value,
                      )
                    }
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      active
                        ? "border-[#d1bcff]/40 bg-[#d1bcff]/10 text-[#d1bcff]"
                        : "border-white/10 bg-white/[0.03] text-[#948e9c] hover:bg-white/[0.05] hover:text-[#cbc4d2]"
                    }`}
                  >
                    {active && (
                      <Check
                        size={12}
                      />
                    )}

                    {option.label}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* Dietary */}
        <div className="border-t border-white/10 pt-5">
          <div className="mb-3 flex items-center gap-1.5">
            <Salad
              size={13}
              className="text-[#7f8798]"
            />

            <p className="text-[9px] font-semibold uppercase tracking-wider text-[#7f8798]">
              Dietary Requirement
            </p>
          </div>

          <div className="max-w-xs">
            <Dropdown
              value={
                dietaryRequirement
              }
              options={
                dietaryOptions
              }
              onChangeAction={
                onDietaryChangeAction
              }
            />
          </div>
        </div>
      </Card>
    </section>
  );
}