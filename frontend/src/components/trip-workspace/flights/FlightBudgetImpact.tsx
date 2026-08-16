"use client";

import {
  CircleDollarSign,
  X,
} from "lucide-react";

import {
  Button,
} from "@/components/ui";

import type {
  FlightComparisonOption,
} from "@/types/trip-workspace";

interface FlightBudgetImpactProps {
  open: boolean;

  currentFlight:
    FlightComparisonOption;

  selectedFlight:
    FlightComparisonOption;

  currency: string;

  totalBudget: number;

  estimatedCost: number;

  onCloseAction: () => void;

  onConfirmAction: () => void;
}

export default function FlightBudgetImpact({
  open,
  currentFlight,
  selectedFlight,
  currency,
  totalBudget,
  estimatedCost,
  onCloseAction,
  onConfirmAction,
}: FlightBudgetImpactProps) {
  if (!open) {
    return null;
  }

  const difference =
    selectedFlight.price -
    currentFlight.price;

  const newEstimatedCost =
    estimatedCost +
    difference;

  const remaining =
    totalBudget -
    newEstimatedCost;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close"
        onClick={onCloseAction}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#fb7185]/25 bg-[#0D1324]/95 p-5 shadow-[0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-6">
        <button
          type="button"
          onClick={onCloseAction}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[#948e9c] hover:bg-white/[0.05] hover:text-white"
        >
          <X size={15} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#fb7185]/20 bg-[#fb7185]/10 text-[#fb7185]">
            <CircleDollarSign
              size={19}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#e6e0e8]">
              Budget Impact
            </h2>

            <p className="mt-0.5 text-xs text-[#948e9c]">
              Review before changing your flight.
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-[#cbc4d2]">
          Selecting{" "}
          <span className="font-semibold text-[#e6e0e8]">
            {
              selectedFlight.airline
            }
          </span>{" "}
          instead of{" "}
          <span className="font-semibold text-[#e6e0e8]">
            {
              currentFlight.airline
            }
          </span>{" "}
          will update your trip budget.
        </p>

        <div className="mt-5 space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <BudgetRow
            label="Total Trip Budget"
            value={`${currency} ${totalBudget.toLocaleString()}`}
          />

          <BudgetRow
            label="Current Flight"
            value={`${currency} ${currentFlight.price.toLocaleString()}`}
          />

          <BudgetRow
            label="New Flight"
            value={`${currency} ${selectedFlight.price.toLocaleString()}`}
            accent="amber"
          />

          <div className="h-px bg-white/10" />

          <BudgetRow
            label="New Estimated Trip"
            value={`${currency} ${newEstimatedCost.toLocaleString()}`}
          />

          <BudgetRow
            label="Remaining Budget"
            value={`${currency} ${remaining.toLocaleString()}`}
            accent={
              remaining >= 0
                ? "coral"
                : "danger"
            }
          />
        </div>

        {difference !== 0 && (
          <p
            className={`mt-3 text-right text-xs font-medium ${
              difference < 0
                ? "text-emerald-400"
                : "text-[#fcd34d]"
            }`}
          >
            {difference < 0
              ? `You save ${currency} ${Math.abs(
                  difference,
                ).toLocaleString()}.`
              : `This adds ${currency} ${difference.toLocaleString()} to the trip.`}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={
              onCloseAction
            }
          >
            Cancel
          </Button>

          <Button
            onClick={
              onConfirmAction
            }
          >
            Confirm Selection
          </Button>
        </div>
      </div>
    </div>
  );
}

function BudgetRow({
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
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-[#948e9c]">
        {label}
      </span>

      <span
        className={`text-sm font-semibold ${
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
      </span>
    </div>
  );
}