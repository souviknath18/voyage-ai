"use client";

import {
  Bot,
  CalendarDays,
  Download,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";

import {
  Badge,
  Button,
  DestinationImage,
} from "@/components/ui";

import type {
  TripWorkspaceHeaderData,
} from "@/types/trip-workspace";

interface TripWorkspaceHeroProps {
  trip: TripWorkspaceHeaderData;

  onAskAIAction: () => void;
  onOptimizeAction: () => void;
  onShareAction: () => void;
  onExportAction: () => void;
}

export default function TripWorkspaceHero({
  trip,
  onAskAIAction,
  onOptimizeAction,
  onShareAction,
  onExportAction,
}: TripWorkspaceHeroProps) {
  return (
    <section className="group relative min-h-[300px] overflow-hidden rounded-xl border border-white/10 bg-[#070B18]">
      {/* Destination Background Image */}
      <div className="absolute inset-0">
        <DestinationImage
          src={trip.image}
          alt={`${trip.destination} trip`}
          className="h-full w-full"
          imageClassName="object-center"
        />
      </div>

      {/* Dark Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/10" />

      {/* Main Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B18] via-[#070B18]/55 to-[#070B18]/10" />

      {/* Side Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#070B18]/35 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[300px] flex-col justify-end p-4 sm:p-5 lg:p-6">
        {/* Status + Meta */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="success">
            {trip.status === "ready"
              ? "AI Plan Ready"
              : trip.status === "planning"
                ? "Planning"
                : "Needs Attention"}
          </Badge>

          {/* Travelers */}
          <span className="flex items-center gap-1.5 text-xs text-[#cbc4d2]">
            <Users
              size={13}
              className="shrink-0"
            />

            {trip.travelers}{" "}
            {trip.travelers === 1
              ? "Traveler"
              : "Travelers"}
          </span>

          {/* Dates */}
          <span className="flex items-center gap-1.5 text-xs text-[#cbc4d2]">
            <CalendarDays
              size={13}
              className="shrink-0"
            />

            {trip.startDate}
            {" - "}
            {trip.endDate}
          </span>
        </div>

        {/* Route + Budget */}
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          {/* Route */}
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#948e9c]">
              Your Trip
            </p>

            <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#e6e0e8] sm:text-2xl lg:text-3xl">
              {trip.origin}

              <span className="mx-2 text-[#fb7185]">
                →
              </span>

              {trip.destination}
            </h1>

            <p className="mt-1.5 text-sm text-[#cbc4d2]">
              {trip.duration}{" "}
              {trip.duration === 1
                ? "Day"
                : "Days"}{" "}
              • AI-curated travel workspace
            </p>
          </div>

          {/* Budget Summary */}
          <div className="grid w-full grid-cols-3 gap-2 rounded-xl border border-white/10 bg-[#070B18]/75 p-3 shadow-[0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:w-auto sm:min-w-[360px] sm:gap-3">
            <BudgetMetric
              label="Budget"
              value={`${trip.currency} ${trip.totalBudget.toLocaleString()}`}
            />

            <BudgetMetric
              label="Estimated"
              value={`${trip.currency} ${trip.estimatedCost.toLocaleString()}`}
              accent="amber"
            />

            <BudgetMetric
              label="Remaining"
              value={`${trip.currency} ${trip.remainingBudget.toLocaleString()}`}
              accent={
                trip.remainingBudget >= 0
                  ? "coral"
                  : "danger"
              }
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={onAskAIAction}
          >
            <Bot size={14} />

            Ask VoyageAI
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOptimizeAction}
          >
            <Sparkles size={14} />

            Optimize Trip
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onShareAction}
          >
            <Share2 size={14} />

            Share
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportAction}
          >
            <Download size={14} />

            Export
          </Button>
        </div>
      </div>
    </section>
  );
}

function BudgetMetric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?:
    | "amber"
    | "coral"
    | "danger";
}) {
  return (
    <div className="min-w-0">
      <p className="truncate text-[9px] font-semibold uppercase tracking-wider text-[#7f8798]">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-[11px] font-semibold sm:text-sm ${
          accent === "amber"
            ? "text-[#fcd34d]"
            : accent === "coral"
              ? "text-[#fb7185]"
              : accent === "danger"
                ? "text-red-400"
                : "text-[#e6e0e8]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}