"use client";

import type {
  TripPlaceFilter,
} from "@/types/trip-workspace";

interface PlacesFiltersProps {
  activeFilter: TripPlaceFilter;

  onChangeAction: (
    filter: TripPlaceFilter,
  ) => void;
}

const filters: {
  value: TripPlaceFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "attraction",
    label: "Attractions",
  },
  {
    value: "food",
    label: "Food",
  },
  {
    value: "culture",
    label: "Culture",
  },
  {
    value: "technology",
    label: "Technology",
  },
  {
    value: "shopping",
    label: "Shopping",
  },
  {
    value: "nature",
    label: "Nature",
  },
  {
    value: "saved",
    label: "Saved",
  },
];

export default function PlacesFilters({
  activeFilter,
  onChangeAction,
}: PlacesFiltersProps) {
  return (
    <div className="overflow-x-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
      <div className="flex min-w-max gap-2 pb-2">
        {filters.map((filter) => {
          const active =
            activeFilter ===
            filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() =>
                onChangeAction(
                  filter.value,
                )
              }
              className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                active
                  ? "border-[#fb7185]/50 bg-[#fb7185]/15 text-[#fb7185]"
                  : "border-white/10 bg-white/[0.04] text-[#948e9c] hover:bg-white/[0.07] hover:text-[#cbc4d2]"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}