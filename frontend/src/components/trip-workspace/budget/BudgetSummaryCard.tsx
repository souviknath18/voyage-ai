"use client";

import {
  CircleCheck,
  WalletCards,
} from "lucide-react";

import {
  Card,
} from "@/components/ui";

interface BudgetSummaryCardProps {
  currency: string;

  totalBudget: number;

  estimatedCost: number;

  remainingBudget: number;
}

export default function BudgetSummaryCard({
  currency,
  totalBudget,
  estimatedCost,
  remainingBudget,
}: BudgetSummaryCardProps) {
  const utilization =
    totalBudget > 0
      ? Math.min(
          Math.round(
            (estimatedCost /
              totalBudget) *
              100,
          ),
          100,
        )
      : 0;

  const withinBudget =
    remainingBudget >= 0;

  return (
    <Card className="relative overflow-hidden p-4 sm:p-5">
      {/* Subtle Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#fb7185]/[0.05] blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2">
          <WalletCards
            size={18}
            className="text-[#fcd34d]"
          />

          <h2 className="text-base font-semibold text-[#e6e0e8]">
            Budget Overview
          </h2>
        </div>

        {/* Numbers */}
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7f8798]">
              Total Assigned Budget
            </p>

            <p className="mt-1 text-2xl font-semibold text-[#e6e0e8] sm:text-3xl">
              {currency}{" "}
              {totalBudget.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:min-w-[300px]">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-[#7f8798]">
                Estimated
              </p>

              <p className="mt-1 text-sm font-semibold text-[#fcd34d]">
                {currency}{" "}
                {estimatedCost.toLocaleString()}
              </p>
            </div>

            <div
              className={`rounded-lg border p-3 ${
                withinBudget
                  ? "border-emerald-400/20 bg-emerald-400/[0.05]"
                  : "border-red-400/20 bg-red-400/[0.05]"
              }`}
            >
              <p className="text-[9px] font-semibold uppercase tracking-wider text-[#7f8798]">
                Remaining
              </p>

              <p
                className={`mt-1 text-sm font-semibold ${
                  withinBudget
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {currency}{" "}
                {remainingBudget.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Utilization */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7f8798]">
              Budget Utilization
            </span>

            <span className="text-sm font-semibold text-[#fb7185]">
              {utilization}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#fb7185] to-[#fcd34d] transition-[width] duration-700"
              style={{
                width: `${utilization}%`,
              }}
            />
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <CircleCheck
              size={13}
              className={
                withinBudget
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            />

            <span
              className={`text-xs ${
                withinBudget
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {withinBudget
                ? "Your current itinerary is within budget."
                : "Your current itinerary exceeds the assigned budget."}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}