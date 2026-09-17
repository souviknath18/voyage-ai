"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import TripShareModal from "./TripShareModal";
import TripWorkspaceHero from "./TripWorkspaceHero";

import type {
  TripWorkspaceHeaderData,
} from "@/types/trip-workspace";

interface TripWorkspaceHeaderProps {
  trip: TripWorkspaceHeaderData;
}

export default function TripWorkspaceHeader({
  trip,
}: TripWorkspaceHeaderProps) {
  const router =
    useRouter();

  const [
    shareOpen,
    setShareOpen,
  ] = useState(false);

  /*
   * MOCK FOR NOW
   *
   * Later the backend will return this:
   *
   * POST /api/trips/:tripId/share
   *
   * {
   *   share_id: "tokyo-x7k92",
   *   share_url: "...",
   * }
   */
  const shareId =
    "tokyo-x7k92";

  const handleAskAI =
    () => {
      /*
       * Later:
       * Open floating assistant
       * through shared assistant state/context.
       */
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
      setShareOpen(
        true,
      );
    };

  const handleExport =
    () => {
      router.push(
        `/trips/${trip.id}/export`,
      );
    };

  return (
    <>
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

      <TripShareModal
        open={shareOpen}
        shareId={shareId}
        tripTitle={
          trip.title
        }
        onCloseAction={() =>
          setShareOpen(
            false,
          )
        }
      />
    </>
  );
}