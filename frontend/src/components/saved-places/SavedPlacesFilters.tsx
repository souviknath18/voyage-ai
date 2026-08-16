"use client";

import {
  Compass,
  Cpu,
  Landmark,
  MoonStar,
  Mountain,
  Trees,
  Utensils,
} from "lucide-react";

import type {
  SavedPlaceCategory,
} from "@/types/saved-places";

interface SavedPlacesFiltersProps {
  activeCategory:
    SavedPlaceCategory;

  onChangeAction: (
    category:
      SavedPlaceCategory,
  ) => void;
}

const categories = [
  {
    value:
      "all" as SavedPlaceCategory,
    label: "All",
    icon: Compass,
  },
  {
    value:
      "food" as SavedPlaceCategory,
    label: "Food",
    icon: Utensils,
  },
  {
    value:
      "culture" as SavedPlaceCategory,
    label: "Culture",
    icon: Landmark,
  },
  {
    value:
      "technology" as SavedPlaceCategory,
    label: "Technology",
    icon: Cpu,
  },
  {
    value:
      "nature" as SavedPlaceCategory,
    label: "Nature",
    icon: Trees,
  },
  {
    value:
      "adventure" as SavedPlaceCategory,
    label: "Adventure",
    icon: Mountain,
  },
  {
    value:
      "nightlife" as SavedPlaceCategory,
    label: "Nightlife",
    icon: MoonStar,
  },
];

export default function SavedPlacesFilters({
  activeCategory,
  onChangeAction,
}: SavedPlacesFiltersProps) {
  return (
    <div className="overflow-x-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
      <div className="flex min-w-max gap-2 pb-2">
        {categories.map(
          (category) => {
            const Icon =
              category.icon;

            const active =
              activeCategory ===
              category.value;

            return (
              <button
                key={
                  category.value
                }
                type="button"
                onClick={() =>
                  onChangeAction(
                    category.value,
                  )
                }
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition ${
                  active
                    ? "border-[#fb7185]/50 bg-[#fb7185]/15 text-[#fb7185]"
                    : "border-white/10 bg-white/[0.04] text-[#948e9c] hover:bg-white/[0.07] hover:text-[#cbc4d2]"
                }`}
              >
                <Icon
                  size={13}
                />

                {
                  category.label
                }
              </button>
            );
          },
        )}
      </div>
    </div>
  );
}