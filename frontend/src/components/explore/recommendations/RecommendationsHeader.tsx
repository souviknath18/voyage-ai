"use client";

import {
  ArrowLeft,
  Sparkles,
} from "lucide-react";

interface RecommendationsHeaderProps {
  onBackAction: () => void;
}

export default function RecommendationsHeader({
  onBackAction,
}: RecommendationsHeaderProps) {
  return (
    <div className="pt-2.5 sm:pt-3">
      <button
        type="button"
        onClick={onBackAction}
        className="mb-3 flex items-center gap-1.5 text-xs font-medium text-[#948e9c] transition hover:text-[#e6e0e8]"
      >
        <ArrowLeft size={14} />

        Back to Explore
      </button>

      <div className="flex items-center gap-2">
        <Sparkles
          size={19}
          className="text-[#fb7185]"
        />

        <h1 className="text-xl font-semibold tracking-tight text-[#e6e0e8] sm:text-2xl">
          AI Recommendations
        </h1>
      </div>

      <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[#948e9c]">
        Destinations selected by VoyageAI based on your
        preferences, saved places and travel style.
      </p>
    </div>
  );
}