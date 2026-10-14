"use client";

import {
  CalendarDays,
  Download,
  Lock,
  Map,
  Plane,
  Printer,
  WalletCards,
} from "lucide-react";

import {
  Button,
} from "@/components/ui";

import type {
  TripExportSettings,
} from "@/types/trip-export";

import type {
  TripWorkspaceData,
} from "@/types/trip-workspace";

import ExportSectionToggle from "./ExportSectionToggle";

interface ExportSettingsProps {
  trip: TripWorkspaceData;

  settings: TripExportSettings;

  onChangeAction: <
    K extends keyof TripExportSettings,
  >(
    key: K,
    value: TripExportSettings[K],
  ) => void;

  onDownloadAction: () => void;

  onPrintAction: () => void;
}

export default function ExportSettings({
  trip,
  settings,
  onChangeAction,
  onDownloadAction,
  onPrintAction,
}: ExportSettingsProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-[#0D1324] lg:h-full lg:w-[280px] xl:w-[300px] lg:border-b-0 lg:border-r">
      {/* Header */}
      <div className="shrink-0 border-b border-white/10 px-5 py-5">
        <h1 className="text-lg font-semibold tracking-tight text-[#e6e0e8]">
          Export Itinerary
        </h1>

        <p className="mt-1 truncate text-xs text-[#948e9c]">
          {trip.title} • {trip.duration}{" "}
          {trip.duration === 1 ? "Day" : "Days"}
        </p>
      </div>

      {/* Scrollable Settings */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Include Sections */}
        <section className="px-5 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d1bcff]">
            Include Sections
          </p>

          <div className="mt-3 space-y-1">
            <ExportSectionToggle
              icon={CalendarDays}
              label="Daily Itinerary"
              checked={settings.itinerary}
              onChangeAction={(value) =>
                onChangeAction(
                  "itinerary",
                  value,
                )
              }
            />

            <ExportSectionToggle
              icon={WalletCards}
              label="Cost Breakdown"
              checked={settings.budget}
              onChangeAction={(value) =>
                onChangeAction(
                  "budget",
                  value,
                )
              }
            />

            <ExportSectionToggle
              icon={Plane}
              label="Booking Details"
              checked={settings.bookings}
              onChangeAction={(value) =>
                onChangeAction(
                  "bookings",
                  value,
                )
              }
            />

            <ExportSectionToggle
              icon={Map}
              label="Map Previews"
              checked={settings.maps}
              onChangeAction={(value) =>
                onChangeAction(
                  "maps",
                  value,
                )
              }
            />
          </div>
        </section>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/10" />

        {/* Security */}
        <section className="px-5 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d1bcff]">
            Security & Privacy
          </p>

          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.025] p-3">
            <ExportSectionToggle
              icon={Lock}
              label="Mask Sensitive Data"
              description="Hide confirmation numbers, payment details and private information."
              checked={
                settings.maskSensitiveData
              }
              onChangeAction={(value) =>
                onChangeAction(
                  "maskSensitiveData",
                  value,
                )
              }
            />
          </div>
        </section>

        {/* Helper */}
        <div className="px-5 pb-5">
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
            <p className="text-[11px] leading-5 text-[#7f8798]">
              Your export will only contain the
              sections selected above.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="shrink-0 border-t border-white/10 bg-[#0A0F1F] px-5 py-4">
        <div className="space-y-2">
          <Button
            fullWidth
            onClick={onDownloadAction}
          >
            <Download size={15} />

            Download PDF
          </Button>

          <Button
            fullWidth
            variant="outline"
            onClick={onPrintAction}
          >
            <Printer size={15} />

            Print Document
          </Button>
        </div>
      </div>
    </aside>
  );
}