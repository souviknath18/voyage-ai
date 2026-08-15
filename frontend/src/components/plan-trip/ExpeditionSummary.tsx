"use client";

import {
  Badge,
  Button,
  Card,
} from "@/components/ui";

import {
  ArrowRight,
  Bot,
  Zap,
} from "lucide-react";

import type { TripFormData } from "@/types/trip";

interface ExpeditionSummaryProps {
  trip: TripFormData;
  onPlanAction: () => void;
  loading?: boolean;
}

export default function ExpeditionSummary({
  trip,
  onPlanAction,
  loading = false,
}: ExpeditionSummaryProps) {
  const calculateDuration = () => {
    if (!trip.startDate || !trip.endDate) {
      return "Not set";
    }

    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    const diff = end.getTime() - start.getTime();

    const days =
      Math.ceil(
        diff / (1000 * 60 * 60 * 24),
      ) + 1;

    if (days <= 0) {
      return "Invalid";
    }

    return `${days} Days`;
  };

  return (
    <Card className="border-t-[#fb7185]/40 p-4 sm:p-5">
      {/* Header */}
      <h2 className="mb-3.5 text-base font-semibold text-[#e6e0e8] sm:mb-4 sm:text-lg">
        Expedition Summary
      </h2>

      {/* Summary Rows */}
      <SummaryRow
        label="Route"
        value={`${trip.origin || "TBD"} → ${
          trip.destination || "TBD"
        }`}
      />

      <SummaryRow
        label="Duration"
        value={calculateDuration()}
      />

      <SummaryRow
        label="Travelers"
        value={String(trip.travelers)}
      />

      <SummaryRow
        label="Pace"
        value={
          trip.pace.charAt(0).toUpperCase() +
          trip.pace.slice(1)
        }
        accent
      />

      {/* Interests */}
      <div className="mt-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#948e9c] sm:text-[11px]">
          Key Themes
        </p>

        <div className="flex flex-wrap gap-1.5">
          {trip.interests.length > 0 ? (
            trip.interests.map((interest) => (
              <Badge
                key={interest}
                variant="neutral"
              >
                {interest}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-[#7f8798] sm:text-[11px]">
              No interests selected
            </span>
          )}
        </div>
      </div>

      {/* Budget */}
      {trip.budget > 0 && (
        <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-3 sm:p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#948e9c] sm:text-[11px]">
            Target Budget
          </p>

          <p className="mt-1 text-base font-semibold text-[#fcd34d] sm:text-lg">
            {trip.currency}{" "}
            {trip.budget.toLocaleString()}
          </p>
        </div>
      )}

      {/* Plan Button */}
      <Button
        fullWidth
        size="md"
        disabled={loading}
        onClick={onPlanAction}
        className="mt-5"
      >
        {loading ? (
          <>
            <Bot
              size={16}
              className="animate-pulse"
            />
            Preparing Agent...
          </>
        ) : (
          <>
            Plan My Trip with AI
            <ArrowRight size={16} />
          </>
        )}
      </Button>

      {/* Footer */}
      <div className="mt-2.5 flex items-center justify-center gap-1 text-[10px] text-[#7f8798] sm:text-[11px]">
        <Zap size={11} />
        <span className="text-center">
          Powered by VoyageAI Agent Engine
        </span>
      </div>
    </Card>
  );
}

function SummaryRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 py-2.5">
      <span className="shrink-0 text-sm text-[#948e9c] sm:text-xs">
        {label}
      </span>

      <span
        className={`min-w-0 max-w-[65%] truncate text-right text-sm font-semibold sm:max-w-[160px] sm:text-xs ${
          accent
            ? "text-[#fb7185]"
            : "text-[#e6e0e8]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}