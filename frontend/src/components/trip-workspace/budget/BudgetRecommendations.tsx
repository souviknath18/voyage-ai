"use client";

import {
  ArrowRight,
  BedDouble,
  Car,
  Plane,
  Route,
  Utensils,
} from "lucide-react";

import {
  Card,
} from "@/components/ui";

import type {
  BudgetRecommendation,
} from "@/types/trip-workspace";

interface BudgetRecommendationsProps {
  recommendations:
    BudgetRecommendation[];

  currency: string;

  onApplyAction: (
    recommendationId: string,
  ) => void;
}

const recommendationIcons = {
  flight: Plane,
  hotel: BedDouble,
  food: Utensils,
  transport: Car,
  activity: Route,
};

export default function BudgetRecommendations({
  recommendations,
  currency,
  onApplyAction,
}: BudgetRecommendationsProps) {
  if (
    recommendations.length ===
    0
  ) {
    return null;
  }

  return (
    <Card className="p-4 sm:p-5">
      <h2 className="text-base font-semibold text-[#e6e0e8]">
        Recommended Adjustments
      </h2>

      <p className="mt-1 text-xs text-[#948e9c]">
        Optional changes that can reduce cost without rebuilding your entire trip.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {recommendations.map(
          (recommendation) => {
            const Icon =
              recommendationIcons[
                recommendation.type
              ];

            return (
              <button
                key={
                  recommendation.id
                }
                type="button"
                onClick={() =>
                  onApplyAction(
                    recommendation.id,
                  )
                }
                className="group flex flex-col rounded-xl border border-white/10 bg-white/[0.025] p-4 text-left transition hover:border-[#fb7185]/25 hover:bg-white/[0.045]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#cbc4d2]">
                    <Icon size={16} />
                  </div>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                    Saves{" "}
                    {currency}{" "}
                    {recommendation.savings.toLocaleString()}
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#e6e0e8]">
                  {recommendation.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-[#948e9c]">
                  {recommendation.description}
                </p>

                <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#fb7185] opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                  Apply

                  <ArrowRight
                    size={12}
                  />
                </span>
              </button>
            );
          },
        )}
      </div>
    </Card>
  );
}