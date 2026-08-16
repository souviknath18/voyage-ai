"use client";

import {
  Bot,
} from "lucide-react";

import {
  Button,
} from "@/components/ui";

import type {
  PlaceDetailsData,
} from "@/types/trip-workspace";

import PlaceAIInsight from "./PlaceAIInsight";
import PlaceDetailsHero from "./PlaceDetailsHero";
import PlaceMapCard from "./PlaceMapCard";
import PlaceMetadataCard from "./PlaceMetadataCard";
import PlaceNearby from "./PlaceNearby";
import PlaceOverview from "./PlaceOverview";

interface PlaceDetailsProps {
  place:
    PlaceDetailsData;

  onBackAction: () => void;

  onSaveAction: () => void;

  onAddAction: () => void;

  onNearbySelectAction?: (
    id: string,
  ) => void;

  onAskAIAction?: () => void;

  onOptimizeAction?: () => void;

  onOpenMapAction?: () => void;
}

export default function PlaceDetails({
  place,
  onBackAction,
  onSaveAction,
  onAddAction,
  onNearbySelectAction,
  onAskAIAction,
  onOptimizeAction,
  onOpenMapAction,
}: PlaceDetailsProps) {
  return (
    <div className="space-y-5">
      {/* Hero */}
      <PlaceDetailsHero
        place={place}
        onBackAction={
          onBackAction
        }
        onSaveAction={
          onSaveAction
        }
        onAddAction={
          onAddAction
        }
      />

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left */}
        <div className="space-y-5 lg:col-span-8">
          {/* Status */}
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#7f8798]">
            <span
              className={`h-2 w-2 rounded-full ${
                place.status ===
                "planned"
                  ? "bg-emerald-400"
                  : place.status ===
                      "saved"
                    ? "bg-[#d1bcff]"
                    : "bg-[#7f8798]"
              }`}
            />

            {place.status ===
            "planned"
              ? `Planned for Day ${place.itineraryDay}`
              : place.status ===
                  "saved"
                ? "Saved Place"
                : "Not in Itinerary"}
          </div>

          {place.aiInsight && (
            <PlaceAIInsight
              insight={
                place.aiInsight
              }
              onPrimaryAction={() =>
                console.log(
                  "Find alternative",
                )
              }
              onOptimizeAction={
                onOptimizeAction
              }
            />
          )}

          <PlaceOverview
            description={
              place.description
            }
          />

          <PlaceNearby
            places={
              place.nearby
            }
            onSelectAction={
              onNearbySelectAction
            }
          />
        </div>

        {/* Right */}
        <aside className="space-y-5 lg:col-span-4">
          <PlaceMetadataCard
            duration={
              place.duration
            }
            estimatedCost={
              place.estimatedCost
            }
            currency={
              place.currency
            }
            openingHours={
              place.openingHours
            }
            bestTime={
              place.bestTime
            }
          />

          <PlaceMapCard
            location={
              place.location
            }
            onOpenMapAction={
              onOpenMapAction
            }
          />

          <Button
            variant="outline"
            fullWidth
            onClick={
              onAskAIAction
            }
          >
            <Bot size={15} />

            Ask VoyageAI about this place
          </Button>
        </aside>
      </div>
    </div>
  );
}