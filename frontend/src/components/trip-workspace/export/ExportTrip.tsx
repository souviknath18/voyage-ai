"use client";

import {
  useState,
} from "react";

import type {
  TripWorkspaceData,
} from "@/types/trip-workspace";

import type {
  TripExportSettings,
} from "@/types/trip-export";

import ExportPreview from "./ExportPreview";
import ExportSettings from "./ExportSettings";

interface ExportTripProps {
  trip:
    TripWorkspaceData;

  onBackAction:
    () => void;
}

export default function ExportTrip({
  trip,
  onBackAction,
}: ExportTripProps) {
  const [
    settings,
    setSettings,
  ] =
    useState<TripExportSettings>({
      itinerary: true,

      budget: true,

      bookings: true,

      maps: false,

      maskSensitiveData:
        true,
    });

  const updateSetting = <
    K extends keyof TripExportSettings,
  >(
    key: K,
    value:
      TripExportSettings[K],
  ) => {
    setSettings(
      (previous) => ({
        ...previous,

        [key]:
          value,
      }),
    );
  };

  const handleDownload =
    () => {
      console.log(
        "Download PDF",
        settings,
      );

      /*
       * Later:
       *
       * POST
       * /api/trips/:tripId/export/pdf/
       *
       * {
       *   itinerary: true,
       *   budget: true,
       *   bookings: true,
       *   maps: false,
       *   mask_sensitive_data: true
       * }
       */
    };

  const handlePrint =
    () => {
      window.print();
    };

  return (
    <div className="flex min-h-0 w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0A0F1F] lg:h-[calc(100dvh-5rem)] lg:flex-row">
      <ExportSettings
        trip={trip}
        settings={
          settings
        }
        onChangeAction={
          updateSetting
        }
        onBackAction={
          onBackAction
        }
        onDownloadAction={
          handleDownload
        }
        onPrintAction={
          handlePrint
        }
      />

      <ExportPreview
        trip={trip}
        settings={
          settings
        }
      />
    </div>
  );
}