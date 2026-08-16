"use client";

import {
  ArrowLeft,
  Sparkles,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Button,
  Card,
} from "@/components/ui";

import type {
  OptimizationPreset,
  TripWorkspaceData,
} from "@/types/trip-workspace";

import OptimizationCustomRequest from "./OptimizationCustomRequest";
import OptimizationPresets from "./OptimizationPresets";
import OptimizeTripHero from "./OptimizeTripHero";

interface OptimizeTripProps {
  trip: TripWorkspaceData;

  onCloseAction: () => void;

  onStartOptimizationAction: (
    presets: OptimizationPreset[],
    customRequest: string,
  ) => void;
}

export default function OptimizeTrip({
  trip,
  onCloseAction,
  onStartOptimizationAction,
}: OptimizeTripProps) {
  const [
    selectedPresets,
    setSelectedPresets,
  ] =
    useState<
      OptimizationPreset[]
    >([]);

  const [
    customRequest,
    setCustomRequest,
  ] =
    useState("");

  const togglePreset = (
    preset: OptimizationPreset,
  ) => {
    setSelectedPresets(
      (previous) =>
        previous.includes(
          preset,
        )
          ? previous.filter(
              (item) =>
                item !==
                preset,
            )
          : [
              ...previous,
              preset,
            ],
    );
  };

  const handleStart =
    () => {
      if (
        selectedPresets.length ===
          0 &&
        !customRequest.trim()
      ) {
        return;
      }

      onStartOptimizationAction(
        selectedPresets,
        customRequest.trim(),
      );
    };

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        type="button"
        onClick={
          onCloseAction
        }
        className="flex items-center gap-1.5 text-xs font-medium text-[#948e9c] transition hover:text-[#e6e0e8]"
      >
        <ArrowLeft
          size={14}
        />

        Back to Trip
      </button>

      {/* Hero */}
      <OptimizeTripHero
        trip={trip}
      />

      {/* Presets */}
      <Card className="p-4 sm:p-5">
        <OptimizationPresets
          selected={
            selectedPresets
          }
          onToggleAction={
            togglePreset
          }
        />
      </Card>

      {/* Custom Request */}
      <Card className="p-4 sm:p-5">
        <OptimizationCustomRequest
          onSubmitAction={(
            request,
          ) =>
            setCustomRequest(
              request,
            )
          }
        />

        {customRequest && (
          <div className="mt-3 rounded-lg border border-[#d1bcff]/15 bg-[#d1bcff]/[0.05] px-3 py-2 text-xs text-[#cbc4d2]">
            <span className="font-semibold text-[#d1bcff]">
              Custom instruction:
            </span>{" "}
            {customRequest}
          </div>
        )}
      </Card>

      {/* Bottom Action */}
      <div className="sticky bottom-4 z-20">
        <div className="rounded-xl border border-white/10 bg-[#070B18]/90 p-3 shadow-[0_15px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#e6e0e8]">
                Ready to optimize?
              </p>

              <p className="mt-0.5 text-[11px] text-[#7f8798]">
                VoyageAI will create a proposal before changing your current trip.
              </p>
            </div>

            <Button
              onClick={
                handleStart
              }
              disabled={
                selectedPresets.length ===
                  0 &&
                !customRequest.trim()
              }
              className="sm:min-w-[190px]"
            >
              <Sparkles
                size={15}
              />

              Optimize Trip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}