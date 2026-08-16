"use client";

import {
  Card,
} from "@/components/ui";

import {
  CircleCheck,
  LoaderCircle,
} from "lucide-react";

interface PlanningProgressProps {
  progress: number;
}

export default function PlanningProgress({
  progress,
}: PlanningProgressProps) {
  const safeProgress =
    Math.min(
      Math.max(progress, 0),
      100,
    );

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {safeProgress ===
            100 ? (
              <CircleCheck
                size={17}
                className="text-emerald-400"
              />
            ) : (
              <LoaderCircle
                size={17}
                className="animate-spin text-[#fb7185]"
              />
            )}

            <h2 className="text-sm font-semibold text-[#e6e0e8]">
              Planning Progress
            </h2>
          </div>

          <p className="mt-1 text-xs text-[#948e9c]">
            VoyageAI is researching,
            comparing and validating
            your trip.
          </p>
        </div>

        <span className="text-lg font-semibold text-[#fb7185]">
          {safeProgress}%
        </span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#fb7185] to-[#fcd34d] transition-[width] duration-700 ease-out"
          style={{
            width: `${safeProgress}%`,
          }}
        />
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-[#7f8798]">
        <span>
          Researching
        </span>

        <span>
          Optimizing
        </span>

        <span>
          Finalizing
        </span>
      </div>
    </Card>
  );
}