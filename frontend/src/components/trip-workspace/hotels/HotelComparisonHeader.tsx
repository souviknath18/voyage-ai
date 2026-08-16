"use client";

import {
  ArrowLeft,
  CalendarDays,
  Hotel,
  Users,
  WalletCards,
} from "lucide-react";

interface HotelComparisonHeaderProps {
  destination: string;

  startDate: string;
  endDate: string;

  travelers: number;

  nights: number;

  currency: string;

  hotelBudget: number;

  onBackAction: () => void;
}

export default function HotelComparisonHeader({
  destination,
  startDate,
  endDate,
  travelers,
  nights,
  currency,
  hotelBudget,
  onBackAction,
}: HotelComparisonHeaderProps) {
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
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#fb7185]/[0.06] blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1.5 rounded-full border border-[#fb7185]/20 bg-[#fb7185]/10 px-2.5 py-1 font-semibold text-[#fb7185]">
                <Hotel size={11} />

                Accommodation
              </span>

              <span className="flex items-center gap-1.5 text-[#948e9c]">
                <CalendarDays
                  size={12}
                />

                {startDate}
                {" - "}
                {endDate}
              </span>

              <span className="flex items-center gap-1.5 text-[#948e9c]">
                <Users size={12} />

                {travelers}{" "}
                {travelers === 1
                  ? "Traveler"
                  : "Travelers"}
              </span>
            </div>

            <h1 className="mt-3 text-xl font-semibold tracking-tight text-[#e6e0e8] sm:text-2xl">
              Compare Hotels in{" "}
              {destination}
            </h1>

            <p className="mt-2 text-sm text-[#948e9c]">
              {nights}{" "}
              {nights === 1
                ? "Night"
                : "Nights"}{" "}
              • Compare price,
              location and trip fit.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#070B18]/70 p-3 backdrop-blur-xl lg:min-w-[190px]">
            <div className="flex items-center gap-1.5 text-[#7f8798]">
              <WalletCards
                size={12}
              />

              <span className="text-[9px] font-semibold uppercase tracking-wider">
                Hotel Budget
              </span>
            </div>

            <p className="mt-1.5 text-lg font-semibold text-[#fcd34d]">
              {currency}{" "}
              {hotelBudget.toLocaleString()}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}