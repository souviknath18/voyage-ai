import {
  CalendarClock,
  CircleDollarSign,
  Sparkles,
} from "lucide-react";

import {
  Button,
} from "@/components/ui";

import type {
  PlaceDetailsData,
} from "@/types/trip-workspace";

interface PlaceAIInsightProps {
  insight:
    NonNullable<
      PlaceDetailsData["aiInsight"]
    >;

  onPrimaryAction?: () => void;

  onOptimizeAction?: () => void;
}

export default function PlaceAIInsight({
  insight,
  onPrimaryAction,
  onOptimizeAction,
}: PlaceAIInsightProps) {
  const Icon =
    insight.type ===
    "budget"
      ? CircleDollarSign
      : insight.type ===
          "schedule"
        ? CalendarClock
        : Sparkles;

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#fb7185]/20 bg-[#fb7185]/[0.04] p-4 sm:p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#fcd34d]/[0.05] blur-3xl" />

      <div className="relative z-10 flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#fb7185]/20 bg-[#fb7185]/10 text-[#fb7185]">
          <Icon size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#fb7185]">
              VoyageAI Insight
            </h2>

            <Sparkles
              size={12}
              className="text-[#fcd34d]"
            />
          </div>

          <h3 className="mt-1 text-sm font-semibold text-[#e6e0e8]">
            {insight.title}
          </h3>

          <p className="mt-2 text-xs leading-5 text-[#948e9c]">
            {insight.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {onPrimaryAction && (
              <Button
                variant="outline"
                size="sm"
                onClick={
                  onPrimaryAction
                }
              >
                Find Alternative
              </Button>
            )}

            {onOptimizeAction && (
              <Button
                variant="outline"
                size="sm"
                onClick={
                  onOptimizeAction
                }
              >
                Optimize Trip
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}