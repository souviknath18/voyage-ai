"use client";

import Link from "next/link";

import {
  ArrowRight,
  DollarSign,
  Star,
} from "lucide-react";

import {
  ThumbnailImage,
} from "@/components/ui";

import type {
  ValueRecommendation,
} from "@/types/explore";

interface ValueRecommendationListProps {
  recommendations:
    ValueRecommendation[];
}

export default function ValueRecommendationList({
  recommendations,
}: ValueRecommendationListProps) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
        <Star
          size={15}
          fill="currentColor"
          className="text-[#fcd34d]"
        />

        <h2 className="text-base font-semibold text-[#e6e0e8]">
          Smart Value Picks
        </h2>
      </div>

      <div className="space-y-2">
        {recommendations.map(
          (recommendation) => (
            <Link
              key={
                recommendation.id
              }
              href={`/plan-trip?destination=${encodeURIComponent(
                recommendation.city,
              )}`}
              className="group flex items-center gap-3 rounded-lg p-2 transition hover:bg-white/[0.04]"
            >
              <ThumbnailImage
                src={
                  recommendation.image
                }
                alt={`${recommendation.city}, ${recommendation.country}`}
                className="h-14 w-14 shrink-0 rounded-lg"
              />

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-xs font-semibold text-[#e6e0e8] transition group-hover:text-[#fb7185]">
                  {
                    recommendation.city
                  }
                  ,{" "}
                  {
                    recommendation.country
                  }
                </h3>

                <p className="mt-1 truncate text-[10px] text-[#948e9c]">
                  {
                    recommendation.description
                  }
                </p>

                <div className="mt-1.5 flex items-center gap-2">
                  <span className="flex text-[#fcd34d]">
                    {Array.from({
                      length:
                        recommendation.costLevel,
                    }).map(
                      (
                        _,
                        index,
                      ) => (
                        <DollarSign
                          key={
                            index
                          }
                          size={9}
                        />
                      ),
                    )}
                  </span>

                  <span className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[8px] text-[#7f8798]">
                    {
                      recommendation.region
                    }
                  </span>
                </div>
              </div>

              <ArrowRight
                size={13}
                className="text-[#7f8798] transition-transform group-hover:translate-x-0.5 group-hover:text-[#fb7185]"
              />
            </Link>
          ),
        )}
      </div>
    </section>
  );
}