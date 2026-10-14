"use client";

import {
  useState,
} from "react";

import { ArrowLeft } from "lucide-react";

import type {
  TripWorkspaceData,
} from "@/types/trip-workspace";

import type {
  TripExportSettings,
} from "@/types/trip-export";

import { exportTripToPdf } from "@/lib/export-trip-pdf";

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

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] =
    useState<string | null>(null);

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
  
  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    setDownloadError(null);

    try {
      await exportTripToPdf(trip, settings);
    } catch (error) {
      console.error(
        "Failed to generate trip PDF:",
        error,
      );

      setDownloadError(
        "Unable to generate your PDF. Please try again.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint =
    () => {
      window.print();
    };

  return (
    <div className="flex min-h-0 w-full flex-col gap-3">
      <button
        type="button"
        onClick={onBackAction}
        className="flex w-fit shrink-0 items-center gap-1.5 text-xs font-medium text-[#948e9c] transition hover:text-[#e6e0e8]"
      >
        <ArrowLeft size={14} />
        Back to Trip
      </button>

      {/* Export workspace */}
      <div className="flex min-h-0 w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0A0F1F] lg:h-[calc(100dvh-8rem)] lg:flex-row">
        <ExportSettings
          trip={trip}
          settings={
            settings
          }
          onChangeAction={
            updateSetting
          }
          onDownloadAction={
            handleDownload
          }
          onPrintAction={
            handlePrint
          }
        />
        
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {downloadError && (
            <div
              role="alert"
              className="mx-4 mt-4 shrink-0 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
            >
              {downloadError}
            </div>
          )}

          <ExportPreview
            trip={trip}
            settings={settings}
          />
        </div>
      </div>
    </div>
  );
}