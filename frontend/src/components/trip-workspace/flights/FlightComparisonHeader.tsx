"use client";

import {
  ArrowLeft,
  CalendarDays,
  Plane,
  Users,
  WalletCards,
} from "lucide-react";

interface FlightComparisonHeaderProps {
  origin: string;

  destination: string;

  originCode?: string;

  destinationCode?: string;

  startDate: string;

  endDate: string;

  travelers: number;

  currency: string;

  flightBudget: number;

  onBackAction: () => void;
}

export default function FlightComparisonHeader({
  origin,
  destination,
  originCode,
  destinationCode,
  startDate,
  endDate,
  travelers,
  currency,
  flightBudget,
  onBackAction,
}: FlightComparisonHeaderProps) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onBackAction}
        className="flex items-center gap-1.5 text-xs font-medium text-[#948e9c] transition hover:text-[#e6e0e8]"
      >
        <ArrowLeft size={14} />

        Back to Trip
      </button>

      <section className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#fb7185]/[0.06] blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              <span className="rounded-full border border-[#fb7185]/20 bg-[#fb7185]/10 px-2.5 py-1 font-semibold text-[#fb7185]">
                Round Trip
              </span>

              <span className="flex items-center gap-1.5 text-[#948e9c]">
                <Users size={12} />

                {travelers}{" "}
                {travelers === 1
                  ? "Traveler"
                  : "Travelers"}
              </span>

              <span className="flex items-center gap-1.5 text-[#948e9c]">
                <CalendarDays
                  size={12}
                />

                {startDate}
                {" - "}
                {endDate}
              </span>
            </div>

            <h1 className="mt-3 flex flex-wrap items-center gap-2 text-xl font-semibold tracking-tight text-[#e6e0e8] sm:text-2xl">
              {origin}

              {originCode && (
                <span className="text-sm text-[#948e9c]">
                  ({originCode})
                </span>
              )}

              <Plane
                size={18}
                className="text-[#fb7185]"
              />

              {destination}

              {destinationCode && (
                <span className="text-sm text-[#948e9c]">
                  ({destinationCode})
                </span>
              )}
            </h1>

            <p className="mt-2 text-sm text-[#948e9c]">
              Compare VoyageAI's shortlisted flight options for your trip.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#070B18]/70 p-3 backdrop-blur-xl lg:min-w-[190px]">
            <div className="flex items-center gap-1.5 text-[#7f8798]">
              <WalletCards
                size={12}
              />

              <span className="text-[9px] font-semibold uppercase tracking-wider">
                Flight Budget
              </span>
            </div>

            <p className="mt-1.5 text-lg font-semibold text-[#fcd34d]">
              {currency}{" "}
              {flightBudget.toLocaleString()}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}