"use client";

import Link from "next/link";

import {
  ArrowRight,
  DollarSign,
} from "lucide-react";

import {
  DestinationImage,
} from "@/components/ui";

import type {
  SimilarRecommendation,
} from "@/types/explore";

interface SimilarRecommendationCardProps {
  recommendation:
    SimilarRecommendation;
}

export default function SimilarRecommendationCard({
  recommendation,
}: SimilarRecommendationCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-[#fb7185]/25">
      <div className="relative h-36 overflow-hidden">
        <DestinationImage
          src={recommendation.image}
          alt={`${recommendation.city}, ${recommendation.country}`}
          className="absolute inset-0 h-full w-full"
          imageClassName="object-center transition-transform duration-700 group-hover:scale-[1.05]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#070B18] via-transparent to-black/10" />

        <h3 className="absolute bottom-3 left-3 text-sm font-semibold text-[#e6e0e8]">
          {recommendation.city},{" "}
          {recommendation.country}
        </h3>
      </div>

      <div className="p-4">
        <p className="line-clamp-3 text-xs leading-5 text-[#948e9c]">
          {
            recommendation.description
          }
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
          <div className="flex text-[#fcd34d]">
            {Array.from({
              length:
                recommendation.costLevel,
            }).map((_, index) => (
              <DollarSign
                key={index}
                size={11}
              />
            ))}
          </div>

          <Link
            href={`/plan-trip?destination=${encodeURIComponent(
              recommendation.city,
            )}`}
            className="flex items-center gap-1 text-[10px] font-semibold text-[#fb7185] transition hover:text-[#fcd34d]"
          >
            Explore

            <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </article>
  );
}