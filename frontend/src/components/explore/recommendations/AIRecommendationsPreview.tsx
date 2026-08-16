"use client";

import Link from "next/link";

import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import {
  Button,
  DestinationImage,
} from "@/components/ui";

import type {
  AIRecommendation,
} from "@/types/explore";

interface AIRecommendationsPreviewProps {
  recommendations: AIRecommendation[];
}

export default function AIRecommendationsPreview({
  recommendations,
}: AIRecommendationsPreviewProps) {
  const preview =
    recommendations.slice(0, 4);

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles
              size={16}
              className="text-[#fb7185]"
            />

            <h2 className="text-base font-semibold text-[#e6e0e8] sm:text-lg">
              Recommended For You
            </h2>
          </div>

          <p className="mt-1 text-xs leading-5 text-[#948e9c]">
            Personalized destinations based on your travel
            preferences and saved interests.
          </p>
        </div>

        <Link href="/explore/recommended">
          <Button
            variant="outline"
            size="sm"
          >
            View All

            <ArrowRight size={13} />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {preview.map(
          (recommendation) => (
            <Link
              key={recommendation.id}
              href="/explore/recommended"
              className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-[#fb7185]/25 hover:bg-white/[0.05]"
            >
              <div className="relative h-36 overflow-hidden">
                <DestinationImage
                  src={
                    recommendation.image
                  }
                  alt={`${recommendation.city}, ${recommendation.country}`}
                  className="absolute inset-0 h-full w-full"
                  imageClassName="object-center transition-transform duration-700 group-hover:scale-[1.05]"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B18] via-transparent to-black/10" />

                {recommendation.matchScore && (
                  <span className="absolute right-2.5 top-2.5 rounded-full border border-[#fb7185]/20 bg-[#070B18]/70 px-2 py-1 text-[9px] font-semibold text-[#fb7185] backdrop-blur-xl">
                    {recommendation.matchScore}% Match
                  </span>
                )}

                <div className="absolute bottom-3 left-3">
                  <h3 className="text-sm font-semibold text-white">
                    {recommendation.city},{" "}
                    {recommendation.country}
                  </h3>
                </div>
              </div>

              <div className="p-3">
                <p className="line-clamp-2 text-[11px] leading-5 text-[#948e9c]">
                  {recommendation.reason}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {recommendation.tags
                    .slice(0, 3)
                    .map(
                      (tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-[#d1bcff]/15 bg-[#d1bcff]/[0.06] px-2 py-1 text-[9px] text-[#d1bcff]"
                        >
                          {tag}
                        </span>
                      ),
                    )}
                </div>
              </div>
            </Link>
          ),
        )}
      </div>
    </section>
  );
}