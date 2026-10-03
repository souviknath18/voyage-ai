"use client";

import {
  History,
  Map,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Button,
} from "@/components/ui";

import type {
  ItineraryVersion,
} from "@/lib/trips";

import type {
  ItineraryDayData,
  TripMapDay,
} from "@/types/trip-workspace";

import ItineraryAIPrompt from "./ItineraryAIPrompt";
import ItineraryDay from "./ItineraryDay";
import ItineraryMapPanel from "./ItineraryMapPanel";
import ItineraryVersionHistory from "./ItineraryVersionHistory";
import {
  useRouter,
} from "next/navigation";

interface TripItineraryProps {
  tripId: string;
  itinerary: ItineraryDayData[];
  currency: string;

  version: number;
  currentVersion: number;

  versions: ItineraryVersion[];

  restoringVersion: number | null;

  onViewVersionAction: (
    version: number,
  ) => void;

  onRestoreVersionAction: (
    version: number,
  ) => void;
}

export default function TripItinerary({
  tripId,
  itinerary,
  currency,
  version,
  currentVersion,
  versions,
  restoringVersion,
  onViewVersionAction,
  onRestoreVersionAction,
}: TripItineraryProps) {
  const router = useRouter();
  const [
    selectedDayIndex,
    setSelectedDayIndex,
  ] = useState(0);

  const [
    historyOpen,
    setHistoryOpen,
  ] = useState(false);

  const selectedDay =
    itinerary[
      selectedDayIndex
    ];

  const openSelectedDayMap =
    () => {
      if (!selectedDay) {
        return;
      }

      router.push(
        `/trips/${tripId}/map?day=${selectedDay.dayNumber}`,
      );
    };

  if (
    itinerary.length === 0
  ) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-16 text-center">
        <h2 className="text-base font-semibold text-[#e6e0e8]">
          No itinerary yet
        </h2>

        <p className="mt-2 text-sm text-[#948e9c]">
          VoyageAI has not generated
          daily activities for this trip.
        </p>
      </div>
    );
  }

  const handleReplace = (
    activityId: string,
  ) => {
    console.log(
      "Replace activity:",
      activityId,
    );
  };

  const handleRemove = (
    activityId: string,
  ) => {
    console.log(
      "Remove activity:",
      activityId,
    );
  };

  const handleAdd = (
    dayNumber: number,
  ) => {
    console.log(
      "Add activity:",
      dayNumber,
    );
  };

  const handleAIPrompt = (
    prompt: string,
  ) => {
    console.log(
      "VoyageAI itinerary request:",
      prompt,
    );
  };

  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
      {/* Main Itinerary */}
      <div className="space-y-6 lg:col-span-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#e6e0e8] sm:text-xl">
              Day-by-Day Itinerary
            </h2>

            <p className="mt-1 text-sm text-[#948e9c]">
              Your AI-generated schedule,
              optimized around travel time,
              interests and budget.
            </p>
          </div>

          <div className="flex items-center gap-2">

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setHistoryOpen(
                  (previous) => !previous,
                )
              }
            >
              <History size={14} />

              Version {version}

              {version !== currentVersion && (
                <span className="text-[9px] font-semibold text-amber-400">
                  HISTORY
                </span>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={
                openSelectedDayMap
              }
            >
              <Map size={14} />

              Map View
            </Button>

          </div>
        </div>

        {historyOpen && (
          <ItineraryVersionHistory
            versions={versions}
            currentVersion={
              currentVersion
            }
            viewingVersion={
              version
            }
            restoringVersion={
              restoringVersion
            }
            onViewAction={(
              selectedVersion,
            ) => {
              onViewVersionAction(
                selectedVersion,
              );

              setSelectedDayIndex(
                0,
              );
            }}
            onRestoreAction={(
              selectedVersion,
            ) => {
              onRestoreVersionAction(
                selectedVersion,
              );

              setSelectedDayIndex(
                0,
              );
            }}
          />
        )}

        {/* Day Selector */}
        <div className="overflow-x-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="flex min-w-max gap-2 pb-2">
            {itinerary.map(
              (
                day,
                index,
              ) => {
                const active =
                  index ===
                  selectedDayIndex;

                return (
                  <button
                    key={
                      day.id
                    }
                    type="button"
                    onClick={() =>
                      setSelectedDayIndex(
                        index,
                      )
                    }
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                      active
                        ? "border-[#fb7185]/50 bg-[#fb7185]/15 text-[#fb7185]"
                        : "border-white/10 bg-white/[0.04] text-[#948e9c] hover:bg-white/[0.07] hover:text-[#cbc4d2]"
                    }`}
                  >
                    Day{" "}
                    {
                      day.dayNumber
                    }
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* Selected Day */}
        <ItineraryDay
          day={
            selectedDay
          }
          currency={
            currency
          }
          onReplaceActivityAction={
            handleReplace
          }
          onRemoveActivityAction={
            handleRemove
          }
          onAddActivityAction={
            handleAdd
          }
        />

        {/* Ask VoyageAI */}
        <ItineraryAIPrompt
          onSubmitAction={
            handleAIPrompt
          }
        />
      </div>

      {/* Map */}
      <aside className="hidden lg:col-span-4 lg:block">
        <ItineraryMapPanel
          tripId={
            tripId
          }
          day={
            selectedDay
          }
        />
      </aside>
    </div>
  );
}