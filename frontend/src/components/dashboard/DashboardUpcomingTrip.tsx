"use client";

import {
  CalendarDays,
  Hotel,
  Plane,
  WalletCards,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  Badge,
  Button,
} from "@/components/ui";

import type {
  TripWorkspaceData,
} from "@/types/trip-workspace";

interface DashboardUpcomingTripProps {
  trip:
    TripWorkspaceData;
}

export default function DashboardUpcomingTrip({
  trip,
}: DashboardUpcomingTripProps) {
  const router =
    useRouter();

  return (
    <article className="flex h-full min-h-[340px] flex-col rounded-xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7f8798]">
            Up Next
          </p>

          <h2 className="mt-2 text-xl font-semibold text-[#e6e0e8]">
            {trip.destination}
          </h2>
        </div>

        <Badge variant="success">
          Confirmed
        </Badge>
      </div>

      {/* Dates */}
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#948e9c]">
        <CalendarDays
          size={13}
        />

        {trip.startDate}
        {" - "}
        {trip.endDate}

        <span>
          •
        </span>

        {trip.duration} Days
      </p>

      {/* Details */}
      <div className="mt-6 space-y-0">
        <TripInfoRow
          icon={Plane}
          label="Flights"
          value="Booked"
        />

        <TripInfoRow
          icon={Hotel}
          label="Stay"
          value={
            trip.hotel.name
          }
        />

        <TripInfoRow
          icon={WalletCards}
          label="Budget"
          value={
            trip.remainingBudget >=
            0
              ? "On Track"
              : "Over Budget"
          }
          last
        />
      </div>

      {/* Budget Progress */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#7f8798]">
            Budget used
          </span>

          <span className="font-medium text-[#fcd34d]">
            {Math.min(
              100,
              Math.round(
                (trip.estimatedCost /
                  trip.totalBudget) *
                  100,
              ),
            )}
            %
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#fb7185] to-[#fcd34d]"
            style={{
              width: `${Math.min(
                100,
                Math.round(
                  (trip.estimatedCost /
                    trip.totalBudget) *
                    100,
                ),
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Button */}
      <div className="mt-auto pt-5">
        <Button
          fullWidth
          variant="outline"
          size="sm"
          onClick={() =>
            router.push(
              `/trips/${trip.id}`,
            )
          }
        >
          View Trip
        </Button>
      </div>
    </article>
  );
}

function TripInfoRow({
  icon: Icon,
  label,
  value,
  last = false,
}: {
  icon:
    React.ComponentType<{
      size?: number;
      className?: string;
    }>;

  label: string;

  value: string;

  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-3 ${
        !last
          ? "border-b border-white/[0.07]"
          : ""
      }`}
    >
      <div className="flex items-center gap-2 text-xs text-[#948e9c]">
        <Icon
          size={14}
        />

        {label}
      </div>

      <p className="max-w-[150px] truncate text-right text-xs font-medium text-[#cbc4d2]">
        {value}
      </p>
    </div>
  );
}