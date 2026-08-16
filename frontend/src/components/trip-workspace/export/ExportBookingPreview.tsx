import {
  Lock,
  Plane,
} from "lucide-react";

import type {
  TripWorkspaceData,
} from "@/types/trip-workspace";

interface ExportBookingPreviewProps {
  trip:
    TripWorkspaceData;

  masked: boolean;
}

export default function ExportBookingPreview({
  trip,
  masked,
}: ExportBookingPreviewProps) {
  const flight =
    trip.flights[0];

  if (!flight) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Plane
          size={18}
          className="text-[#fb7185]"
        />

        <h2 className="text-base font-semibold text-[#e6e0e8]">
          Flight Details
        </h2>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#e6e0e8]">
              {flight.airline}{" "}
              {flight.flightNumber}
            </p>

            <p className="mt-1 text-xs text-[#948e9c]">
              {flight.route}
            </p>
          </div>

          <span className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
            Confirmed
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Detail
            label="Departure"
            value={
              flight.departureTime
            }
          />

          <Detail
            label="Cabin"
            value={
              flight.cabin
            }
          />
        </div>

        <div className="mt-4 border-t border-white/10 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7f8798]">
            Confirmation Record
          </p>

          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-[#cbc4d2]">
            {masked && (
              <Lock
                size={13}
                className="text-[#fb7185]"
              />
            )}

            {masked
              ? "••••••"
              : "X7B9K2"}

            {masked && (
              <span className="text-[10px] font-normal text-[#7f8798]">
                Masked for export
              </span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-[#7f8798]">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium text-[#cbc4d2]">
        {value}
      </p>
    </div>
  );
}