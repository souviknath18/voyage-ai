import {
  CircleCheck,
  WalletCards,
} from "lucide-react";

import {
  Card,
} from "@/components/ui";

import type {
  TripBudgetItem,
} from "@/types/trip-workspace";

interface TripBudgetOverviewProps {
  currency: string;
  totalBudget: number;
  estimatedCost: number;

  items: TripBudgetItem[];
}

export default function TripBudgetOverview({
  currency,
  totalBudget,
  estimatedCost,
  items,
}: TripBudgetOverviewProps) {
  const percentage =
    Math.min(
      Math.round(
        (estimatedCost /
          totalBudget) *
          100,
      ),
      100,
    );

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WalletCards
            size={17}
            className="text-[#fcd34d]"
          />

          <h2 className="text-base font-semibold text-[#e6e0e8]">
            Budget Status
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <CircleCheck size={14} />

          Within Budget
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#fb7185] to-[#fcd34d]"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-[#948e9c]">
        <span>
          {percentage}% used
        </span>

        <span>
          {currency}{" "}
          {estimatedCost.toLocaleString()} /{" "}
          {totalBudget.toLocaleString()}
        </span>
      </div>

      <div className="mt-5 space-y-2.5">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-xs"
          >
            <span className="text-[#948e9c]">
              {item.label}
            </span>

            <span className="font-medium text-[#e6e0e8]">
              {currency}{" "}
              {item.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}