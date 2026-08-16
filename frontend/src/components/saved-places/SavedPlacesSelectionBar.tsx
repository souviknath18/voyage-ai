"use client";

import {
  Sparkles,
  X,
} from "lucide-react";

import {
  Button,
} from "@/components/ui";

interface SavedPlacesSelectionBarProps {
  count: number;

  onClearAction: () => void;

  onCreateTripAction: () => void;
}

export default function SavedPlacesSelectionBar({
  count,
  onClearAction,
  onCreateTripAction,
}: SavedPlacesSelectionBarProps) {
  if (
    count === 0
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 lg:ml-32">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0D1324]/95 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={
              onClearAction
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#948e9c] transition hover:bg-white/[0.05] hover:text-[#e6e0e8]"
          >
            <X size={14} />
          </button>

          <div>
            <p className="text-sm font-semibold text-[#e6e0e8]">
              {count}{" "}
              {count === 1
                ? "place"
                : "places"}{" "}
              selected
            </p>

            <p className="mt-0.5 hidden text-[10px] text-[#7f8798] sm:block">
              VoyageAI can build a trip around your selected places.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={
            onCreateTripAction
          }
        >
          <Sparkles
            size={14}
          />

          Create Trip
        </Button>
      </div>
    </div>
  );
}