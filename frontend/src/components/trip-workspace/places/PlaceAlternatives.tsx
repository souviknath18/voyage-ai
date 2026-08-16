"use client";

import {
  ArrowRight,
  Clock3,
  DollarSign,
  Sparkles,
  Users,
} from "lucide-react";

import {
  Card,
  ThumbnailImage,
} from "@/components/ui";

import type {
  TripPlaceAlternative,
} from "@/types/trip-workspace";

interface PlaceAlternativesProps {
  alternatives:
    TripPlaceAlternative[];

  currency: string;

  onApplyAction: (
    id: string,
  ) => void;
}

const benefitConfig = {
  interest: {
    label:
      "Better Interest Match",
    icon:
      Sparkles,
    color:
      "text-[#fb7185]",
  },

  cost: {
    label:
      "Lower Cost",
    icon:
      DollarSign,
    color:
      "text-emerald-400",
  },

  travel: {
    label:
      "Less Travel",
    icon:
      Clock3,
    color:
      "text-[#d1bcff]",
  },

  crowds: {
    label:
      "Less Crowded",
    icon:
      Users,
    color:
      "text-[#fcd34d]",
  },
};

export default function PlaceAlternatives({
  alternatives,
  currency,
  onApplyAction,
}: PlaceAlternativesProps) {
  if (
    alternatives.length === 0
  ) {
    return null;
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[#e6e0e8] sm:text-lg">
          Recommended Alternatives
        </h2>

        <p className="mt-1 text-xs text-[#948e9c]">
          VoyageAI found options that may improve cost, routing or preference match.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {alternatives.map(
          (alternative) => {
            const config =
              benefitConfig[
                alternative
                  .benefit
              ];

            const Icon =
              config.icon;

            return (
              <Card
                key={
                  alternative.id
                }
                className="group p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <ThumbnailImage
                    src={
                      alternative.image
                    }
                    alt={
                      alternative.name
                    }
                    className="h-32 w-full shrink-0 rounded-lg sm:h-28 sm:w-32"
                  />

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div
                      className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider ${config.color}`}
                    >
                      <Icon size={12} />

                      {config.label}
                    </div>

                    <h3 className="mt-2 text-sm font-semibold text-[#e6e0e8]">
                      {
                        alternative.name
                      }
                    </h3>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#948e9c]">
                      {
                        alternative.description
                      }
                    </p>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                      {alternative.savings !==
                        undefined && (
                        <span className="text-xs font-semibold text-emerald-400">
                          Save{" "}
                          {
                            currency
                          }{" "}
                          {alternative.savings.toLocaleString()}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          onApplyAction(
                            alternative.id,
                          )
                        }
                        className="ml-auto flex items-center gap-1 text-xs font-semibold text-[#fb7185] transition hover:text-[#fcd34d]"
                      >
                        Review

                        <ArrowRight
                          size={12}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          },
        )}
      </div>
    </section>
  );
}