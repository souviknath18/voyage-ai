"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Bot,
  Clock3,
} from "lucide-react";

interface PlanningHeaderProps {
  running?: boolean;
}

export default function PlanningHeader({
  running = true,
}: PlanningHeaderProps) {
  const [seconds, setSeconds] =
    useState(0);

  useEffect(() => {
    if (!running) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setSeconds(
          (previous) =>
            previous + 1,
        );
      }, 1000);

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, [running]);

  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    seconds % 60;

  const elapsed = `${String(
    minutes,
  ).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-4 pt-2.5 sm:flex-row sm:items-end sm:justify-between sm:pt-3">
      <div>
        <div className="flex items-center gap-2">
          <Bot
            size={20}
            className="text-[#fb7185]"
          />

          <h1 className="text-xl font-semibold tracking-tight text-[#e6e0e8] sm:text-2xl">
            Crafting Your Journey
          </h1>
        </div>

        <div className="mt-1.5 flex items-center gap-2 text-sm text-[#948e9c]">
          {running && (
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#fb7185]" />
          )}

          <span>
            {running
              ? "VoyageAI is actively planning your trip..."
              : "VoyageAI finished planning your trip."}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[#948e9c]">
        <Clock3 size={15} />

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7f8798]">
            Elapsed Time
          </p>

          <p className="mt-0.5 font-mono text-sm font-semibold text-[#fb7185]">
            {elapsed}
          </p>
        </div>
      </div>
    </div>
  );
}