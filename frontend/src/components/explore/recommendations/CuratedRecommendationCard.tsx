"use client";

import Link from "next/link";

import {
  Bookmark,
  CalendarDays,
  DollarSign,
  Sparkles,
  Sun,
} from "lucide-react";

import {
  Button,
  DestinationImage,
} from "@/components/ui";

import type {
  AIRecommendation,
} from "@/types/explore";

interface CuratedRecommendationCardProps {
  recommendation: AIRecommendation;

  saved: boolean;

  onSaveAction: (
    id: string,
  ) => void;
}

export default function CuratedRecommendationCard({
  recommendation,
  saved,
  onSaveAction,
}: CuratedRecommendationCardProps) {
  return (
    <article
      className={`group relative min-h-[390px] overflow-hidden rounded-xl border bg-[#070B18] ${
        recommendation.featured
          ? "border-[#fb7185]/35 shadow-[0_0_25px_rgba(251,113,133,0.08)]"
          : "border-white/10"
      }`}
    >
      <DestinationImage
        src={recommendation.image}
        alt={`${recommendation.city}, ${recommendation.country}`}
        className="absolute inset-0 h-full w-full"
        imageClassName="object-center transition-transform duration-700 group-hover:scale-[1.04]"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B18] via-[#070B18]/55 to-black/15" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4">
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#070B18]/65 px-2.5 py-1.5 backdrop-blur-xl">
          <Sparkles
            size={12}
            className="text-[#fcd34d]"
          />

          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#e6e0e8]">
            {recommendation.featured
              ? "VoyageAI Pick"
              : "High Match"}
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            onSaveAction(
              recommendation.id,
            )
          }
          className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#070B18]/60 backdrop-blur-xl transition ${
            saved
              ? "text-[#fb7185]"
              : "text-[#e6e0e8] hover:text-[#fb7185]"
          }`}
        >
          <Bookmark
            size={14}
            fill={
              saved
                ? "currentColor"
                : "none"
            }
          />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
        <div className="mb-3 inline-flex max-w-full rounded-lg border border-white/10 bg-[#070B18]/70 px-3 py-2 backdrop-blur-xl">
          <p className="text-[10px] leading-4 text-[#cbc4d2]">
            {recommendation.reason}
          </p>
        </div>

        <h2 className="text-xl font-semibold text-[#e6e0e8] sm:text-2xl">
          {recommendation.city},{" "}
          {recommendation.country}
        </h2>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-[#cbc4d2]">
          <span className="flex items-center gap-1">
            <DollarSign size={11} />

            {Array.from({
              length:
                recommendation.costLevel,
            }).map((_, index) => (
              <span key={index}>
                $
              </span>
            ))}
          </span>

          <span className="flex items-center gap-1">
            <CalendarDays
              size={11}
            />

            {
              recommendation.idealStay
            }
          </span>

          <span className="flex items-center gap-1">
            <Sun size={11} />

            {
              recommendation.bestTime
            }
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {recommendation.tags.map(
            (tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-1 text-[9px] text-[#e6e0e8]"
              >
                {tag}
              </span>
            ),
          )}
        </div>

        <Link
          href={`/plan-trip?destination=${encodeURIComponent(
            recommendation.city,
          )}`}
          className="mt-4 block"
        >
          <Button
            fullWidth
            size="sm"
          >
            <Sparkles size={13} />

            Plan This Trip
          </Button>
        </Link>
      </div>
    </article>
  );
}