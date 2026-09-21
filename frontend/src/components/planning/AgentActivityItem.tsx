"use client";

import {
  BrainCircuit,
  CircleCheck,
  CloudSun,
  DollarSign,
  Hotel,
  Hourglass,
  Landmark,
  LoaderCircle,
  Map,
  Plane,
  Sparkles,
  TriangleAlert,
  XCircle,
} from "lucide-react";

import type {
  PlanningStep,
  PlanningStepIcon,
} from "@/types/planning";

interface AgentActivityItemProps {
  step: PlanningStep;
  last?: boolean;
}

const stepIcons: Record<
  PlanningStepIcon,
  React.ComponentType<{
    size?: number;
    className?: string;
  }>
> = {
  preferences: BrainCircuit,
  flight: Plane,
  hotel: Hotel,
  budget: DollarSign,
  places: Landmark,
  weather: CloudSun,
  cost: DollarSign,
  itinerary: Map,
  final: Sparkles,
};

export default function AgentActivityItem({
  step,
  last = false,
}: AgentActivityItemProps) {
  const StepIcon =
    stepIcons[step.icon];

  const statusConfig = {
    completed: {
      container:
        "border-white/10 bg-white/[0.03]",
      circle:
        "border-emerald-400/30 bg-[#0B1719] text-emerald-400",
      StatusIcon:
        CircleCheck,
    },

    running: {
      container:
        "border-[#fb7185]/30 bg-[#fb7185]/[0.06]",
      circle:
        "border-[#fb7185]/50 bg-[#1B1020] text-[#fb7185] shadow-[0_0_18px_rgba(251,113,133,0.2)]",
      StatusIcon:
        LoaderCircle,
    },

    queued: {
      container:
        "border-white/10 bg-white/[0.02] opacity-50",
      circle:
        "border-white/10 bg-[#0D1324] text-[#7f8798]",
      StatusIcon:
        Hourglass,
    },

    warning: {
      container:
        "border-[#fcd34d]/25 bg-[#fcd34d]/[0.05]",
      circle:
        "border-[#fcd34d]/40 bg-[#201B12] text-[#fcd34d]",
      StatusIcon:
        TriangleAlert,
    },

    failed: {
      container:
        "border-red-400/25 bg-red-400/[0.05]",
      circle:
        "border-red-400/40 bg-[#201116] text-red-400",
      StatusIcon:
        XCircle,
    },
  };

  const config =
    statusConfig[step.status];

  const StatusIcon =
    config.StatusIcon;

  return (
    <div className="relative flex gap-3 sm:gap-4">
      {/* Timeline */}
      <div className="relative flex shrink-0 flex-col items-center">
        {/* Status Circle */}
        <div
          className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border ${config.circle}`}
        >
          <StatusIcon
            size={17}
            className={
              step.status ===
              "running"
                ? "animate-spin"
                : ""
            }
          />
        </div>

        {/* Connector Line */}
        {!last && (
          <div className="absolute bottom-0 left-1/2 top-9 w-px -translate-x-1/2 bg-white/10" />
        )}
      </div>

      {/* Content */}
      <div
        className={`mb-5 min-w-0 flex-1 rounded-lg border p-3.5 sm:p-4 ${config.container}`}
      >
        <div className="flex items-start gap-3">
          <StepIcon
            size={16}
            className={`mt-0.5 shrink-0 ${
              step.status ===
              "warning"
                ? "text-[#fcd34d]"
                : step.status ===
                    "running"
                  ? "text-[#fb7185]"
                  : "text-[#948e9c]"
            }`}
          />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className={`text-sm font-medium ${step.status === "warning" ? "text-[#fcd34d]" : "text-[#e6e0e8]"}`}>
                {step.title}
              </p>

              {step.duration && (
                <span className="font-mono text-[10px] text-[#7f8798]">
                  {step.duration}
                </span>
              )}

              {step.status ===
                "running" && (
                <div className="flex items-center gap-1">
                  <span className="h-1 w-1 animate-bounce rounded-full bg-[#fb7185]" />

                  <span className="h-1 w-1 animate-bounce rounded-full bg-[#fb7185] [animation-delay:150ms]" />

                  <span className="h-1 w-1 animate-bounce rounded-full bg-[#fb7185] [animation-delay:300ms]" />
                </div>
              )}
            </div>

            {step.description && (
              <p className="mt-1 text-xs leading-5 text-[#948e9c]">
                {step.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}