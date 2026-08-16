"use client";

import {
  useRouter,
} from "next/navigation";

import TripWorkspaceHero from "./TripWorkspaceHero";

import type {
  TripWorkspaceData,
} from "@/types/trip-workspace";

interface TripWorkspaceHeaderProps {
  trip: TripWorkspaceData;
}

export default function TripWorkspaceHeader({
  trip,
}: TripWorkspaceHeaderProps) {
  const router =
    useRouter();

  const handleAskAI =
    () => {
      console.log(
        "Open VoyageAI assistant",
      );
    };

  const handleOptimize =
    () => {
      router.push(
        `/trips/${trip.id}/optimize`,
      );
    };

  const handleShare =
    () => {
      console.log(
        "Share trip",
      );
    };

  const handleExport =
    () => {
      console.log(
        "Export trip",
      );
    };

  return (
    <TripWorkspaceHero
      trip={trip}
      onAskAIAction={
        handleAskAI
      }
      onOptimizeAction={
        handleOptimize
      }
      onShareAction={
        handleShare
      }
      onExportAction={
        handleExport
      }
    />
  );
}