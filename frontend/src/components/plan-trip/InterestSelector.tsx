"use client";

import { Card } from "@/components/ui";

import {
  Camera,
  Dumbbell,
  Footprints,
  Heart,
  Landmark,
  Mountain,
  Music,
  ShoppingBag,
  Utensils,
} from "lucide-react";

interface InterestSelectorProps {
  selected: string[];
  onChangeAction: (interests: string[]) => void;
}

const interests = [
  {
    value: "food",
    label: "Food & Dining",
    icon: Utensils,
  },
  {
    value: "adventure",
    label: "Adventure",
    icon: Footprints,
  },
  {
    value: "nature",
    label: "Nature",
    icon: Mountain,
  },
  {
    value: "culture",
    label: "Culture & Arts",
    icon: Landmark,
  },
  {
    value: "history",
    label: "History",
    icon: Landmark,
  },
  {
    value: "shopping",
    label: "Shopping",
    icon: ShoppingBag,
  },
  {
    value: "nightlife",
    label: "Nightlife",
    icon: Music,
  },
  {
    value: "wellness",
    label: "Wellness",
    icon: Dumbbell,
  },
  {
    value: "photography",
    label: "Photography",
    icon: Camera,
  },
];

export default function InterestSelector({
  selected,
  onChangeAction,
}: InterestSelectorProps) {
  const toggleInterest = (interest: string) => {
    if (selected.includes(interest)) {
      onChangeAction(
        selected.filter(
          (item) => item !== interest,
        ),
      );
    } else {
      onChangeAction([
        ...selected,
        interest,
      ]);
    }
  };

  return (
    <Card className="p-4 sm:p-5">
      {/* Header */}
      <div className="mb-3.5 flex items-center gap-2.5 sm:mb-4">
        <Heart
          size={18}
          className="shrink-0 text-[#fb7185] sm:size-[19px]"
        />

        <h2 className="text-base font-semibold text-[#e6e0e8] sm:text-lg">
          Core Interests
        </h2>
      </div>

      {/* Interests */}
      <div className="flex flex-wrap gap-2">
        {interests.map((interest) => {
          const Icon = interest.icon;

          const active =
            selected.includes(
              interest.value,
            );

          return (
            <button
              key={interest.value}
              type="button"
              onClick={() =>
                toggleInterest(
                  interest.value,
                )
              }
              className={`flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-all sm:px-3.5 ${
                active
                  ? "border-[#fb7185] bg-[#fb7185]/15 text-[#fb7185]"
                  : "border-white/10 bg-white/[0.04] text-[#948e9c] hover:bg-white/[0.08] hover:text-[#cbc4d2]"
              }`}
            >
              <Icon
                size={14}
                className="shrink-0"
              />

              <span className="whitespace-nowrap">
                {interest.label}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}