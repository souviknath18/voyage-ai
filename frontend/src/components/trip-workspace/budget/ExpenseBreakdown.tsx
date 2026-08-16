import {
  Activity,
  Hotel,
  Plane,
  ShoppingBag,
  TrainFront,
  Utensils,
  WalletCards,
} from "lucide-react";

import {
  Card,
} from "@/components/ui";

import type {
  TripBudgetCategory,
} from "@/types/trip-workspace";

interface ExpenseBreakdownProps {
  categories: TripBudgetCategory[];

  currency: string;

  estimatedCost: number;
}

const categoryIcons = {
  flight: Plane,
  hotel: Hotel,
  food: Utensils,
  transport: TrainFront,
  activities: Activity,
  shopping: ShoppingBag,
  buffer: WalletCards,
};

const categoryColors = {
  flight:
    "bg-[#fcd34d]",

  hotel:
    "bg-[#fb7185]",

  food:
    "bg-[#d1bcff]",

  transport:
    "bg-cyan-400",

  activities:
    "bg-emerald-400",

  shopping:
    "bg-pink-400",

  buffer:
    "bg-[#948e9c]",
};

export default function ExpenseBreakdown({
  categories,
  currency,
  estimatedCost,
}: ExpenseBreakdownProps) {
  return (
    <Card className="p-4 sm:p-5">
      <h2 className="text-base font-semibold text-[#e6e0e8]">
        Expense Breakdown
      </h2>

      <p className="mt-1 text-xs text-[#948e9c]">
        Estimated allocation across your main trip expenses.
      </p>

      <div className="mt-5 space-y-4">
        {categories.map(
          (category) => {
            const Icon =
              categoryIcons[
                category.type
              ];

            const percentage =
              estimatedCost > 0
                ? Math.round(
                    (category.amount /
                      estimatedCost) *
                      100,
                  )
                : 0;

            return (
              <div
                key={category.id}
                className="group"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#cbc4d2]">
                      <Icon size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#e6e0e8]">
                        {category.label}
                      </p>

                      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#7f8798]">
                        {category.source ===
                        "live"
                          ? "Live Price"
                          : "AI Estimate"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#e6e0e8]">
                      {currency}{" "}
                      {category.amount.toLocaleString()}
                    </p>

                    <p className="text-[10px] text-[#7f8798]">
                      {percentage}%
                    </p>
                  </div>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      categoryColors[
                        category.type
                      ]
                    }`}
                    style={{
                      width: `${Math.min(
                        percentage,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            );
          },
        )}
      </div>
    </Card>
  );
}