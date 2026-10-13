
"use client";

import {
  CalendarDays,
  Hotel,
  Plane,
  WalletCards,
} from "lucide-react";

import { useRouter } from "next/navigation";

import {
  Badge,
  Button,
} from "@/components/ui";

import type {
  DashboardUpcomingTrip as DashboardUpcomingTripData,
} from "@/lib/dashboard";

interface DashboardUpcomingTripProps {
  trip: DashboardUpcomingTripData | null;
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function calculateDuration(
  startDate: string,
  endDate: string,
): number {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return 0;
  }

  return Math.max(
    1,
    Math.round((end - start) / 86400000) + 1,
  );
}

function formatCurrency(
  amount: string | number,
  currency: string,
): string {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "Not available";
  }

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString("en-IN")} ${currency}`;
  }
}


function getTripStatus(trip: DashboardUpcomingTripData): {
  label: string;
  variant: "success" | "warning" | "neutral";
} {
  switch (trip.lifecycle) {
    case "in_progress":
      return {
        label: "In Progress",
        variant: "success",
      };

    case "completed":
      return {
        label: "Completed",
        variant: "neutral",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        variant: "neutral",
      };

    case "draft":
      return {
        label: "Planning",
        variant: "warning",
      };

    case "upcoming":
      return {
        label: "Upcoming",
        variant: "neutral",
      };

    default:
      // Fallback for older API responses
      return {
        label: trip.status === "draft"
          ? "Planning"
          : "Upcoming",
        variant: trip.status === "draft"
          ? "warning"
          : "neutral",
      };
  }
}

export default function DashboardUpcomingTrip({
  trip,
}: DashboardUpcomingTripProps) {
  const router = useRouter();

  const status = trip ? getTripStatus(trip) : null;

  const duration = trip
    ? calculateDuration(trip.start_date, trip.end_date)
    : 0;

  const selectedFlight = trip?.selected_flight ?? null;
  const selectedHotel = trip?.selected_hotel ?? null;
  const budgetSummary = trip?.budget_summary ?? null;

  const flightLabel = !trip
    ? "—"
    : selectedFlight
      ? selectedFlight.airline
      : "Not selected";

  const hotelLabel = !trip
    ? "—"
    : selectedHotel
      ? selectedHotel.hotel_name
      : "Not selected";

  const budgetLabel =
    budgetSummary !== null
      ? formatCurrency(
          budgetSummary.total_budget,
          budgetSummary.currency,
        )
      : trip?.budget != null
        ? formatCurrency(trip.budget, trip.currency)
        : "Not available";

  const rawUtilization =
    budgetSummary?.utilization_percentage;

  const hasBudgetUtilization =
    rawUtilization !== undefined &&
    rawUtilization !== null &&
    Number.isFinite(rawUtilization);

  const utilization = hasBudgetUtilization
    ? Math.max(0, rawUtilization)
    : 0;

  const progressWidth = Math.min(utilization, 100);

  const utilizationLabel = hasBudgetUtilization
    ? `${utilization.toFixed(1)}%`
    : "—";

  return (
    <article className="flex h-full min-h-[340px] flex-col rounded-xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7f8798]">
            Up Next
          </p>

          <h2 className="mt-2 text-xl font-semibold text-[#e6e0e8]">
            {trip
              ? trip.destination_name || trip.destination
              : "No upcoming trips"}
          </h2>
        </div>

        {status && (
          <Badge variant={status.variant}>
            {status.label}
          </Badge>
        )}
      </div>

      {/* Dates */}
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#948e9c]">
        <CalendarDays size={13} />

        {trip ? (
          <>
            {formatDate(trip.start_date)}
            {" - "}
            {formatDate(trip.end_date)}

            <span>•</span>

            {duration} {duration === 1 ? "Day" : "Days"}
          </>
        ) : (
          "Plan your next adventure"
        )}
      </p>

      {/* Details */}
      <div className="mt-6 space-y-0">
        <TripInfoRow
          icon={Plane}
          label="Flights"
          value={flightLabel}
        />

        <TripInfoRow
          icon={Hotel}
          label="Stay"
          value={hotelLabel}
        />

        <TripInfoRow
          icon={WalletCards}
          label="Budget"
          value={budgetLabel}
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
            {utilizationLabel}
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#fb7185] to-[#fcd34d]"
            style={{
              width: `${progressWidth}%`,
            }}
            role="progressbar"
            aria-label="Estimated budget utilization"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              hasBudgetUtilization
                ? progressWidth
                : undefined
            }
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
              trip
                ? `/trips/${trip.trip_id}`
                : "/plan-trip",
            )
          }
        >
          {trip ? "View Trip" : "Plan a Trip"}
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
  icon: React.ComponentType<{
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
        <Icon size={14} />
        {label}
      </div>

      <p
        className="max-w-[150px] truncate text-right text-xs font-medium text-[#cbc4d2]"
        title={value}
      >
        {value}
      </p>
    </div>
  );
}