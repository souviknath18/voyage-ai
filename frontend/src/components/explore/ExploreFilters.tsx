"use client";

import {
  Globe2,
  Heart,
  Sparkles,
  Timer,
  WalletCards,
} from "lucide-react";

import {
  Button,
  Card,
  Dropdown,
  Input,
} from "@/components/ui";

import type {
  ExploreFiltersData,
} from "@/types/explore";

interface ExploreFiltersProps {
  filters: ExploreFiltersData;

  onChangeAction: <K extends keyof ExploreFiltersData>(
    key: K,
    value: ExploreFiltersData[K],
  ) => void;

  onGenerateAction: () => void;
}

const budgetOptions = [
  {
    label: "Any Budget",
    value: "any",
  },
  {
    label: "Value Focused",
    value: "value",
  },
  {
    label: "Balanced Comfort",
    value: "balanced",
  },
  {
    label: "Premium Luxury",
    value: "luxury",
  },
];

const interestOptions = [
  {
    label: "Any Interest",
    value: "any",
  },
  {
    label: "Food & Dining",
    value: "culinary",
  },
  {
    label: "Culture & Heritage",
    value: "culture",
  },
  {
    label: "Nature",
    value: "nature",
  },
  {
    label: "Adventure",
    value: "adventure",
  },
  {
    label: "Technology & Cities",
    value: "technology",
  },
];

const durationOptions = [
  {
    label: "Any Duration",
    value: "any",
  },
  {
    label: "Weekend",
    value: "weekend",
  },
  {
    label: "5 - 7 Days",
    value: "5-7",
  },
  {
    label: "7 - 10 Days",
    value: "7-10",
  },
  {
    label: "2+ Weeks",
    value: "14+",
  },
];

export default function ExploreFilters({
  filters,
  onChangeAction,
  onGenerateAction,
}: ExploreFiltersProps) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {/* Region */}
        <Input
          value={filters.region}
          onChange={(event) =>
            onChangeAction(
              "region",
              event.target.value,
            )
          }
          placeholder="Anywhere"
          leftIcon={
            <Globe2 size={15} />
          }
        />

        {/* Budget */}
        <Dropdown
          value={filters.budgetStyle}
          options={budgetOptions}
          onChangeAction={(value) =>
            onChangeAction(
              "budgetStyle",
              value,
            )
          }
          placeholder="Budget style"
        />

        {/* Interest */}
        <Dropdown
          value={filters.interest}
          options={interestOptions}
          onChangeAction={(value) =>
            onChangeAction(
              "interest",
              value,
            )
          }
          placeholder="Interest"
        />

        {/* Duration */}
        <Dropdown
          value={filters.duration}
          options={durationOptions}
          onChangeAction={(value) =>
            onChangeAction(
              "duration",
              value,
            )
          }
          placeholder="Duration"
        />

        {/* Generate */}
        <Button
          fullWidth
          onClick={onGenerateAction}
          className="h-[46px]"
        >
          <Sparkles size={16} />
          Discover
        </Button>
      </div>

      {/* Small helper row */}
      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-[#7f8798]">
        <span className="flex items-center gap-1">
          <WalletCards size={12} />
          Budget-aware
        </span>

        <span className="flex items-center gap-1">
          <Heart size={12} />
          Interest-based
        </span>

        <span className="flex items-center gap-1">
          <Timer size={12} />
          Duration-aware
        </span>
      </div>
    </Card>
  );
}