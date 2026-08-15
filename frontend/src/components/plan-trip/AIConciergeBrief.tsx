"use client";

import {
  Card,
  Textarea,
} from "@/components/ui";

import { Sparkles } from "lucide-react";

interface AIConciergeBriefProps {
  value: string;
  onChangeAction: (value: string) => void;
}

export default function AIConciergeBrief({
  value,
  onChangeAction,
}: AIConciergeBriefProps) {
  return (
    <Card className="p-4 sm:p-5">
      {/* Header */}
      <div className="mb-2 flex items-center gap-2.5">
        <Sparkles
          size={18}
          className="shrink-0 text-[#fcd34d] sm:size-[19px]"
        />

        <h2 className="text-base font-semibold text-[#e6e0e8] sm:text-lg">
          AI Concierge Brief
        </h2>
      </div>

      {/* Description */}
      <p className="mb-3 text-xs leading-5 text-[#948e9c] sm:mb-4">
        Tell VoyageAI about specific requests, dietary
        requirements, accessibility needs, preferred
        experiences, or the overall vibe you want your trip
        to have.
      </p>

      {/* AI Instructions */}
      <div className="ai-pulse-border w-full rounded-lg">
        <Textarea
          value={value}
          onChange={(event) =>
            onChangeAction(event.target.value)
          }
          placeholder="e.g. I want hidden local food spots, one premium dining experience, easy public transport, boutique hotels and a relaxed schedule..."
          className="min-h-[120px] w-full text-sm sm:min-h-[110px] sm:text-xs"
        />
      </div>
    </Card>
  );
}